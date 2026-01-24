import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAds } from '../context/AdsContext';
import { COLORS } from '../constants/config';

/**
 * MOCKED Banner Ad Component for Expo Go
 * In production builds, this will use react-native-google-mobile-ads
 */
const BannerAdComponent = () => {
  const { showBanner } = useAds();

  if (!showBanner) return null;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.mockBanner}>
        <Text style={styles.mockBannerText}>📢 Ad Space (Mocked)</Text>
        <Text style={styles.mockBannerSubtext}>Real ads in production build</Text>
      </View>
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
  mockBanner: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.GOLD,
  },
  mockBannerText: {
    color: COLORS.GOLD,
    fontSize: 12,
    fontWeight: '600',
  },
  mockBannerSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
  },
});

export default BannerAdComponent;
