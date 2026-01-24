import { useState, useCallback, useRef, useEffect } from 'react';

// Mock Ads Manager - simulates mobile ads behavior
// In a real mobile app, this would use Google Mobile Ads SDK

const useAdsManager = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(() => {
    return localStorage.getItem('flappyfish_ads_removed') === 'true';
  });
  const deathCountRef = useRef(0);
  const interstitialReadyRef = useRef(true);

  // Banner Ad IDs (mock - would be real IDs in production)
  const adConfig = {
    android: {
      bannerId: 'ca-app-pub-3940256099942544/6300978111',
      interstitialId: 'ca-app-pub-3940256099942544/1033173712',
    },
    ios: {
      bannerId: 'ca-app-pub-3940256099942544/2934735716',
      interstitialId: 'ca-app-pub-3940256099942544/4411468910',
    },
  };

  // Initialize ads (simulated)
  useEffect(() => {
    if (!adsRemoved) {
      console.log('[AdsManager] Initialized - Banner and Interstitial ads ready');
      setShowBanner(true);
    }
  }, [adsRemoved]);

  // Called on game over - shows interstitial every 3 deaths
  const onGameOver = useCallback(() => {
    if (adsRemoved) return;

    deathCountRef.current += 1;
    console.log(`[AdsManager] Death count: ${deathCountRef.current}`);

    // Show interstitial every 3 deaths
    if (deathCountRef.current >= 3 && deathCountRef.current % 3 === 0) {
      if (interstitialReadyRef.current) {
        setShowInterstitial(true);
        interstitialReadyRef.current = false;
        
        // Simulate ad loading time for next interstitial
        setTimeout(() => {
          interstitialReadyRef.current = true;
        }, 5000);
      }
    }
  }, [adsRemoved]);

  // Close interstitial ad
  const closeInterstitial = useCallback(() => {
    setShowInterstitial(false);
  }, []);

  // Remove ads (purchased)
  const removeAds = useCallback(() => {
    setAdsRemoved(true);
    setShowBanner(false);
    setShowInterstitial(false);
    localStorage.setItem('flappyfish_ads_removed', 'true');
    console.log('[AdsManager] Ads removed - Premium user');
  }, []);

  // Hide banner temporarily
  const hideBanner = useCallback(() => {
    if (!adsRemoved) {
      setShowBanner(false);
    }
  }, [adsRemoved]);

  // Show banner
  const showBannerAd = useCallback(() => {
    if (!adsRemoved) {
      setShowBanner(true);
    }
  }, [adsRemoved]);

  return {
    showBanner: showBanner && !adsRemoved,
    showInterstitial,
    adsRemoved,
    onGameOver,
    closeInterstitial,
    removeAds,
    hideBanner,
    showBannerAd,
    adConfig,
    deathCount: deathCountRef.current,
  };
};

export default useAdsManager;
