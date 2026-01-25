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

// Get Ad Unit IDs - Use test IDs in development, production IDs when ready
const getAdUnitId = (type) => {
  if (__DEV__ || AD_CONFIG.USE_TEST_IDS) {
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
  
  // Production IDs
  const ids = AD_CONFIG.PRODUCTION_IDS;
  const platformIds = Platform.OS === 'ios' ? ids[type].IOS : ids[type].ANDROID;
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
  const interstitialRef = useRef(null);
  const rewardedRef = useRef(null);
  const appOpenRef = useRef(null);
  const rewardCallbackRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const lastAppOpenShowTime = useRef(0);

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

    const interstitial = InterstitialAd.createForAdRequest(getAdUnitId('INTERSTITIAL'), {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsInterstitialLoaded(true);
      console.log('[AdsManager] Interstitial loaded');
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setIsInterstitialLoaded(false);
      console.log('[AdsManager] Interstitial closed, reloading...');
      interstitial.load();
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('[AdsManager] Interstitial error:', error);
      setIsInterstitialLoaded(false);
      setTimeout(() => interstitial.load(), 5000);
    });

    interstitialRef.current = interstitial;
    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [adsRemoved]);

  // Initialize Rewarded Ad
  useEffect(() => {
    if (adsRemoved) return;

    const rewarded = RewardedAd.createForAdRequest(getAdUnitId('REWARDED'), {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsRewardedLoaded(true);
      console.log('[AdsManager] Rewarded ad loaded');
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
      console.log('[AdsManager] Rewarded ad closed, reloading...');
      rewarded.load();
    });

    const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('[AdsManager] Rewarded ad error:', error);
      setIsRewardedLoaded(false);
      setTimeout(() => rewarded.load(), 5000);
    });

    rewardedRef.current = rewarded;
    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [adsRemoved]);

  // Initialize App Open Ad
  useEffect(() => {
    if (adsRemoved) return;

    const appOpen = AppOpenAd.createForAdRequest(getAdUnitId('APP_OPEN'), {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = appOpen.addAdEventListener(AdEventType.LOADED, () => {
      setIsAppOpenLoaded(true);
      console.log('[AdsManager] App Open ad loaded');
    });

    const unsubscribeClosed = appOpen.addAdEventListener(AdEventType.CLOSED, () => {
      setIsAppOpenLoaded(false);
      console.log('[AdsManager] App Open ad closed, reloading...');
      appOpen.load();
    });

    const unsubscribeError = appOpen.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('[AdsManager] App Open ad error:', error);
      setIsAppOpenLoaded(false);
      setTimeout(() => appOpen.load(), 5000);
    });

    appOpenRef.current = appOpen;
    appOpen.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
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

  // Show App Open ad on initial launch - DISABLED to not interrupt
  useEffect(() => {
    // Disabled - don't show app open ad on launch
    // This was interrupting the user experience
    return;
  }, [isAppOpenLoaded, adsRemoved]);

  // Show App Open Ad
  const showAppOpenAd = useCallback(() => {
    if (adsRemoved) return;
    
    if (isAppOpenLoaded && appOpenRef.current) {
      console.log('[AdsManager] Showing App Open ad...');
      lastAppOpenShowTime.current = Date.now();
      appOpenRef.current.show();
    }
  }, [adsRemoved, isAppOpenLoaded]);

  // Called on game over - tracks deaths for interstitial frequency
  const onGameOver = useCallback(() => {
    if (adsRemoved) return;

    deathCountRef.current += 1;
    console.log(`[AdsManager] Death count: ${deathCountRef.current}`);

    // Show interstitial every N deaths
    if (
      deathCountRef.current >= AD_CONFIG.INTERSTITIAL_FREQUENCY &&
      deathCountRef.current % AD_CONFIG.INTERSTITIAL_FREQUENCY === 0
    ) {
      showInterstitial();
    }
  }, [adsRemoved]);

  // Show interstitial ad
  const showInterstitial = useCallback(() => {
    if (adsRemoved) return;
    
    if (isInterstitialLoaded && interstitialRef.current) {
      console.log('[AdsManager] Showing interstitial...');
      interstitialRef.current.show();
    } else {
      console.log('[AdsManager] Interstitial not ready');
    }
  }, [adsRemoved, isInterstitialLoaded]);

  // Show rewarded ad (for revive)
  const showRewardedAd = useCallback((onReward) => {
    if (isRewardedLoaded && rewardedRef.current) {
      console.log('[AdsManager] Showing rewarded ad...');
      rewardCallbackRef.current = onReward;
      rewardedRef.current.show();
      return true;
    }
    console.log('[AdsManager] Rewarded ad not ready, granting reward anyway');
    onReward && onReward({ amount: 1, type: 'revive' });
    return false;
  }, [isRewardedLoaded]);

  // Remove ads (purchased)
  const removeAds = useCallback(async () => {
    setAdsRemoved(true);
    setShowBanner(false);
    await AsyncStorage.setItem('flappyfish_ads_removed', 'true');
    console.log('[AdsManager] Ads removed - Premium user');
  }, []);

  // Hide/show banner
  const hideBanner = useCallback(() => {
    if (!adsRemoved) setShowBanner(false);
  }, [adsRemoved]);

  const showBannerAd = useCallback(() => {
    if (!adsRemoved) setShowBanner(true);
  }, [adsRemoved]);

  const value = {
    showBanner: showBanner && !adsRemoved,
    adsRemoved,
    isInterstitialLoaded,
    isRewardedLoaded,
    isAppOpenLoaded,
    onGameOver,
    showInterstitial,
    showRewardedAd,
    showAppOpenAd,
    removeAds,
    hideBanner,
    showBannerAd,
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
