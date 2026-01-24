import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useAds } from '../context/AdsContext';

// Banner Ad Component using Google Mobile Ads SDK
export const BannerAdComponent = () => {
  const { showBanner, bannerAdUnitId } = useAds();

  if (!showBanner) return null;

  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('[BannerAd] Loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.log('[BannerAd] Failed to load:', error);
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
  },
});

export default BannerAdComponent;