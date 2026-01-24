import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AD_CONFIG } from '../constants/config';

const AdsContext = createContext();

/**
 * MOCKED ADS PROVIDER for Expo Go
 * Real Google Mobile Ads will be integrated in production builds
 */
export const AdsProvider = ({ children }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(true); // Always "ready" in mock
  const [isRewardedLoaded, setIsRewardedLoaded] = useState(true);
  
  const deathCountRef = useRef(0);

  // Load ads removed status on mount
  React.useEffect(() => {
    AsyncStorage.getItem('flappyfish_ads_removed').then((value) => {
      if (value === 'true') {
        setAdsRemoved(true);
        setShowBanner(false);
      }
    });
  }, []);

  // Called on game over - tracks death count for interstitial frequency
  const onGameOver = useCallback(() => {
    if (adsRemoved) return;

    deathCountRef.current += 1;
    console.log(`[MockAds] Death count: ${deathCountRef.current}`);

    // In production, this would show interstitial every N deaths
    if (
      deathCountRef.current >= AD_CONFIG.INTERSTITIAL_FREQUENCY &&
      deathCountRef.current % AD_CONFIG.INTERSTITIAL_FREQUENCY === 0
    ) {
      console.log('[MockAds] Would show interstitial ad here');
    }
  }, [adsRemoved]);

  // Mock interstitial - just logs in Expo Go
  const showInterstitial = useCallback(() => {
    if (adsRemoved) return;
    console.log('[MockAds] Interstitial ad displayed (mocked)');
  }, [adsRemoved]);

  // Mock rewarded ad - immediately triggers reward callback
  const showRewardedAd = useCallback((onReward) => {
    console.log('[MockAds] Rewarded ad displayed (mocked)');
    // Simulate watching an ad with a short delay
    setTimeout(() => {
      console.log('[MockAds] Reward earned!');
      onReward && onReward();
    }, 500);
    return true;
  }, []);

  // Remove ads (for premium purchase)
  const removeAds = useCallback(async () => {
    setAdsRemoved(true);
    setShowBanner(false);
    await AsyncStorage.setItem('flappyfish_ads_removed', 'true');
    console.log('[MockAds] Ads removed - Premium user');
  }, []);

  // Hide/show banner controls
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
    // Mock banner unit ID
    bannerAdUnitId: 'mock-banner-id',
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
