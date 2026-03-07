import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Platform, AppState } from 'react-native';
import {
  InterstitialAd,
  RewardedAd,
  AppOpenAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AD_CONFIG } from '../constants/config';

const AdsContext = createContext();

// Get Ad Unit IDs - Use test IDs only when explicitly enabled
const getAdUnitId = (type) => {
  // Only use test IDs if explicitly set in config (for testing purposes)
  if (AD_CONFIG.USE_TEST_IDS) {
    // Use Google's official test ad unit IDs
    switch (type) {
      case 'BANNER':
        return TestIds.ADAPTIVE_BANNER;
      case 'INTERSTITIAL':
        return TestIds.INTERSTITIAL;
      case 'REWARDED':
        return TestIds.REWARDED;
      case 'APP_OPEN':
        return TestIds.APP_OPEN;
      default:
        return TestIds.BANNER;
    }
  }
  
  // Production IDs - always use these unless USE_TEST_IDS is true
  const ids = AD_CONFIG.PRODUCTION_IDS;
  const platformIds = Platform.OS === 'ios' ? ids[type].IOS : ids[type].ANDROID;
  console.log(`[AdsManager] Using ${type} ad unit:`, platformIds);
  return platformIds;
};

export const AdsProvider = ({ children }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);
  const [isRewardedLoaded, setIsRewardedLoaded] = useState(false);
  const [isAppOpenLoaded, setIsAppOpenLoaded] = useState(false);
  const [isGamePlaying, setIsGamePlaying] = useState(false); // Track if game is active
  
  const deathCountRef = useRef(0);
  const gameStartCountRef = useRef(0); // Track game starts for interstitial
  const interstitialRef = useRef(null);
  const rewardedRef = useRef(null);
  const appOpenRef = useRef(null);
  const rewardCallbackRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const lastAppOpenShowTime = useRef(0);
  const rewardedAdRetryCount = useRef(0); // Track retries for rewarded ad

  // Load ads removed status
  useEffect(() => {
    AsyncStorage.getItem('flappyfish_ads_removed').then((value) => {
      if (value === 'true') {
        setAdsRemoved(true);
        setShowBanner(false);
      }
    });
  }, []);

  // Initialize Interstitial Ad
  useEffect(() => {
    if (adsRemoved) return;

    // Small delay to ensure SDK is fully initialized
    const initDelay = setTimeout(() => {
      const adUnitId = getAdUnitId('INTERSTITIAL');
      console.log('[AdsManager] Creating interstitial with ID:', adUnitId);
      
      const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        setIsInterstitialLoaded(true);
        console.log('[AdsManager] Interstitial loaded successfully');
      });

      const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        setIsInterstitialLoaded(false);
        console.log('[AdsManager] Interstitial closed, reloading...');
        interstitial.load();
      });

      const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        console.log('[AdsManager] Interstitial error code:', error.code, 'message:', error.message);
        setIsInterstitialLoaded(false);
        setTimeout(() => interstitial.load(), 5000);
      });

      interstitialRef.current = interstitial;
      console.log('[AdsManager] Loading interstitial ad...');
      interstitial.load();

      // Periodic preload check for interstitial
      const preloadInterval = setInterval(() => {
        if (!isInterstitialLoaded && interstitialRef.current) {
          console.log('[AdsManager] Periodic interstitial preload');
          interstitialRef.current.load();
        }
      }, 15000); // Check every 15 seconds

      // Store cleanup functions
      interstitialRef.current._cleanup = () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        clearInterval(preloadInterval);
      };
    }, 1000);

    return () => {
      clearTimeout(initDelay);
      if (interstitialRef.current?._cleanup) {
        interstitialRef.current._cleanup();
      }
    };
  }, [adsRemoved]);

  // Initialize Rewarded Ad with better reliability
  useEffect(() => {
    if (adsRemoved) return;

    // Small delay to ensure SDK is fully initialized
    const initDelay = setTimeout(() => {
      const adUnitId = getAdUnitId('REWARDED');
      console.log('[AdsManager] Creating rewarded ad with ID:', adUnitId);
      
      const rewarded = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setIsRewardedLoaded(true);
        rewardedAdRetryCount.current = 0; // Reset retry count on success
        console.log('[AdsManager] Rewarded ad loaded successfully');
      });

      const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('[AdsManager] User earned reward:', reward);
        if (rewardCallbackRef.current) {
          rewardCallbackRef.current(reward);
          rewardCallbackRef.current = null;
        }
      });

      const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        setIsRewardedLoaded(false);
        console.log('[AdsManager] Rewarded ad closed, reloading immediately...');
        // Reload immediately when closed
        setTimeout(() => rewarded.load(), 100);
      });

      const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
        console.log('[AdsManager] Rewarded ad error code:', error.code, 'message:', error.message);
        setIsRewardedLoaded(false);
        rewardedAdRetryCount.current += 1;
        // Exponential backoff with max of 30 seconds
        const retryDelay = Math.min(1000 * Math.pow(2, rewardedAdRetryCount.current), 30000);
        console.log(`[AdsManager] Retrying rewarded ad in ${retryDelay}ms (attempt ${rewardedAdRetryCount.current})`);
        setTimeout(() => rewarded.load(), retryDelay);
      });

      rewardedRef.current = rewarded;
      console.log('[AdsManager] Loading rewarded ad...');
      rewarded.load();

      // Also preload periodically to ensure ad is ready
      const preloadInterval = setInterval(() => {
        if (!isRewardedLoaded && rewardedRef.current) {
          console.log('[AdsManager] Periodic rewarded ad preload check');
          rewardedRef.current.load();
        }
      }, 15000); // Check every 15 seconds

      // Store cleanup functions
      rewardedRef.current._cleanup = () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
        clearInterval(preloadInterval);
      };
    }, 1000);

    return () => {
      clearTimeout(initDelay);
      if (rewardedRef.current?._cleanup) {
        rewardedRef.current._cleanup();
      }
    };
  }, [adsRemoved]);

  // Initialize App Open Ad
  useEffect(() => {
    if (adsRemoved) return;

    // Small delay to ensure SDK is fully initialized
    const initDelay = setTimeout(() => {
      const adUnitId = getAdUnitId('APP_OPEN');
      console.log('[AdsManager] Creating app open ad with ID:', adUnitId);
      
      const appOpen = AppOpenAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubscribeLoaded = appOpen.addAdEventListener(AdEventType.LOADED, () => {
        setIsAppOpenLoaded(true);
        console.log('[AdsManager] App Open ad loaded successfully');
      });

      const unsubscribeClosed = appOpen.addAdEventListener(AdEventType.CLOSED, () => {
        setIsAppOpenLoaded(false);
        console.log('[AdsManager] App Open ad closed, reloading...');
        appOpen.load();
      });

      const unsubscribeError = appOpen.addAdEventListener(AdEventType.ERROR, (error) => {
        console.log('[AdsManager] App Open ad error code:', error.code, 'message:', error.message);
        setIsAppOpenLoaded(false);
        setTimeout(() => appOpen.load(), 5000);
      });

      appOpenRef.current = appOpen;
      console.log('[AdsManager] Loading app open ad...');
      appOpen.load();

      // Store cleanup functions
      appOpenRef.current._cleanup = () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
      };
    }, 1000);

    return () => {
      clearTimeout(initDelay);
      if (appOpenRef.current?._cleanup) {
        appOpenRef.current._cleanup();
      }
    };
  }, [adsRemoved]);

  // Show App Open ad when app comes to foreground
  useEffect(() => {
    // Skip if ads removed or App Open ads are disabled
    if (adsRemoved || AD_CONFIG.DISABLE_APP_OPEN_ADS) return;

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // App came to foreground
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const now = Date.now();
        const cooldown = AD_CONFIG.APP_OPEN_COOLDOWN || 120000;
        // Don't show during gameplay or within cooldown period
        if (!isGamePlaying && now - lastAppOpenShowTime.current > cooldown) {
          showAppOpenAd();
        }
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [adsRemoved, isGamePlaying]);

  // DISABLED: App Open ad on initial launch
  // Per Google Play policy: Ads should not appear immediately on app launch
  // App Open ads will only show when returning from background (handled in AppState listener)
  useEffect(() => {
    // NOTE: Removed app open ad on initial launch to comply with Google Play policy
    // App open ads are only shown when user returns from background after cooldown period
    console.log('[AdsManager] App Open ad on launch DISABLED for policy compliance');
  }, [isAppOpenLoaded, adsRemoved]);

  // Show App Open Ad
  const showAppOpenAd = useCallback(() => {
    if (adsRemoved || AD_CONFIG.DISABLE_APP_OPEN_ADS) return;
    
    // Never show during gameplay
    if (isGamePlaying) {
      console.log('[AdsManager] Skipping App Open ad - game in progress');
      return;
    }
    
    if (isAppOpenLoaded && appOpenRef.current) {
      console.log('[AdsManager] Showing App Open ad...');
      lastAppOpenShowTime.current = Date.now();
      appOpenRef.current.show();
    }
  }, [adsRemoved, isAppOpenLoaded]);

  // Show interstitial ad
  const showInterstitial = useCallback(() => {
    if (adsRemoved) return;
    
    if (isInterstitialLoaded && interstitialRef.current) {
      console.log('[AdsManager] Showing interstitial...');
      interstitialRef.current.show();
    } else {
      console.log('[AdsManager] Interstitial not ready, loaded:', isInterstitialLoaded);
      // Try to load for next time
      if (interstitialRef.current) {
        interstitialRef.current.load();
      }
    }
  }, [adsRemoved, isInterstitialLoaded]);

  // Called on game over - tracks deaths for interstitial frequency
  // Per Google Play policy: Show ads only at natural breaks (game over is appropriate)
  const onGameOver = useCallback(() => {
    if (adsRemoved) return;

    deathCountRef.current += 1;
    const currentDeathCount = deathCountRef.current;
    console.log(`[AdsManager] Death count: ${currentDeathCount}, frequency: ${AD_CONFIG.INTERSTITIAL_FREQUENCY}`);

    // Show interstitial every N deaths (starting from the Nth death)
    if (currentDeathCount % AD_CONFIG.INTERSTITIAL_FREQUENCY === 0) {
      console.log(`[AdsManager] Triggering interstitial on death #${currentDeathCount}`);
      // Wait 1.5 seconds to let user see game over screen and score first
      // This provides a natural break and is policy compliant
      setTimeout(() => {
        if (isInterstitialLoaded && interstitialRef.current) {
          console.log('[AdsManager] Showing interstitial on game over (policy compliant - natural break)...');
          try {
            interstitialRef.current.show();
          } catch (e) {
            console.log('[AdsManager] Error showing interstitial:', e);
            interstitialRef.current.load();
          }
        } else {
          console.log('[AdsManager] Interstitial not ready for game over, loading...');
          if (interstitialRef.current) {
            interstitialRef.current.load();
          }
        }
      }, 1500); // 1.5 second delay - lets user see their score first
    }
  }, [adsRemoved, isInterstitialLoaded]);

  // Called on game start - only tracks count, NO ADS on game start
  // Per Google Play policy: Interstitial ads should NOT appear before gameplay
  const onGameStart = useCallback(() => {
    if (adsRemoved) return;

    gameStartCountRef.current += 1;
    const currentStartCount = gameStartCountRef.current;
    
    console.log(`[AdsManager] Game start count: ${currentStartCount} (no interstitial on start - policy compliant)`);
    // NOTE: Interstitials are ONLY shown on game over, never on game start
    // This complies with Google Play's "Interruptive Ads" policy
  }, [adsRemoved]);

  // Show rewarded ad (for revive) - with better reliability
  const showRewardedAd = useCallback((onReward) => {
    if (adsRemoved) {
      // If ads removed, grant reward immediately
      onReward && onReward({ amount: 1, type: 'revive' });
      return true;
    }

    if (isRewardedLoaded && rewardedRef.current) {
      console.log('[AdsManager] Showing rewarded ad...');
      rewardCallbackRef.current = onReward;
      try {
        rewardedRef.current.show();
        return true;
      } catch (error) {
        console.log('[AdsManager] Error showing rewarded ad:', error);
        // If show fails, try to reload and grant reward
        setIsRewardedLoaded(false);
        rewardedRef.current.load();
        onReward && onReward({ amount: 1, type: 'revive' });
        return false;
      }
    }
    
    console.log('[AdsManager] Rewarded ad not ready, granting reward anyway');
    // Try to load for next time
    if (rewardedRef.current) {
      rewardedRef.current.load();
    }
    onReward && onReward({ amount: 1, type: 'revive' });
    return false;
  }, [isRewardedLoaded, adsRemoved]);

  // Remove ads (for future use if needed - currently unused)
  // const removeAds = useCallback(async () => {
  //   setAdsRemoved(true);
  //   setShowBanner(false);
  //   await AsyncStorage.setItem('flappyfish_ads_removed', 'true');
  //   console.log('[AdsManager] Ads removed - Premium user');
  // }, []);

  // Hide/show banner
  const hideBanner = useCallback(() => {
    if (!adsRemoved) setShowBanner(false);
  }, [adsRemoved]);

  const showBannerAd = useCallback(() => {
    if (!adsRemoved) setShowBanner(true);
  }, [adsRemoved]);

  // Set gameplay state - call this when game starts/ends
  const setGameplayActive = useCallback((isActive) => {
    setIsGamePlaying(isActive);
    console.log('[AdsManager] Gameplay active:', isActive);
  }, []);

  const value = {
    showBanner: showBanner && !adsRemoved,
    adsRemoved,
    isInterstitialLoaded,
    isRewardedLoaded,
    isAppOpenLoaded,
    isGamePlaying,
    onGameOver,
    onGameStart,
    showInterstitial,
    showRewardedAd,
    showAppOpenAd,
    hideBanner,
    showBannerAd,
    setGameplayActive,
    bannerAdUnitId: getAdUnitId('BANNER'),
  };

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
};

export const useAds = () => {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error('useAds must be used within AdsProvider');
  }
  return context;
};
