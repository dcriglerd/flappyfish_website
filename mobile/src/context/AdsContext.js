import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import {
  InterstitialAd,
  RewardedAd,
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
      default:
        return TestIds.BANNER;
    }
  }
  
  // Production IDs (replace with your real AdMob IDs)
  const ids = AD_CONFIG.PRODUCTION_IDS;
  const platformIds = Platform.OS === 'ios' ? ids[type].IOS : ids[type].ANDROID;
  return platformIds;
};

export const AdsProvider = ({ children }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);
  const [isRewardedLoaded, setIsRewardedLoaded] = useState(false);
  
  const deathCountRef = useRef(0);
  const interstitialRef = useRef(null);
  const rewardedRef = useRef(null);
  const rewardCallbackRef = useRef(null);

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
      // Reload for next time
      interstitial.load();
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('[AdsManager] Interstitial error:', error);
      setIsInterstitialLoaded(false);
      // Retry loading after delay
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
      // Call the reward callback if set
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
      // Retry loading after delay
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
    // If ad not ready, grant reward anyway (better UX)
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
    onGameOver,
    showInterstitial,
    showRewardedAd,
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
