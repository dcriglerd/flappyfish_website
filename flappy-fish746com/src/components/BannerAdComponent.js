import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useAds } from '../context/AdsContext';
import { COLORS } from '../constants/config';

/**
 * Real Banner Ad Component using Google Mobile Ads SDK
 * Displays adaptive banner ads at the bottom of the screen
 */
const BannerAdComponent = () => {
  const { showBanner, bannerAdUnitId, adsRemoved } = useAds();
  const [adError, setAdError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  if (!showBanner || adsRemoved) return null;

  // If ad failed to load, show nothing (graceful degradation)
  if (adError) {
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          keywords: ['game', 'fish', 'arcade', 'fun'],
        }}
        onAdLoaded={() => {
          console.log('[BannerAd] Loaded successfully');
          setAdLoaded(true);
          setAdError(false);
        }}
        onAdFailedToLoad={(error) => {
          console.log('[BannerAd] Failed to load:', error);
          setAdError(true);
          setAdLoaded(false);
        }}
        onAdOpened={() => {
          console.log('[BannerAd] Opened');
        }}
        onAdClosed={() => {
          console.log('[BannerAd] Closed');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    minHeight: 50,
  },
});

export default BannerAdComponent;
