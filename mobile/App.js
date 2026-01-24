import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import mobileAds from 'react-native-google-mobile-ads';

import FlappyFishGame from './src/screens/FlappyFishGame';
import { AdsProvider } from './src/context/AdsContext';
import { GameProvider } from './src/context/GameContext';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        // Request tracking permission (iOS 14+)
        const { status } = await requestTrackingPermissionsAsync();
        console.log('Tracking permission status:', status);

        // Initialize Google Mobile Ads
        await mobileAds().initialize();
        console.log('Google Mobile Ads initialized');

        setIsReady(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsReady(true); // Continue anyway
      }
    }

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🐠 Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <AdsProvider>
        <GameProvider>
          <FlappyFishGame />
        </GameProvider>
      </AdsProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00b4d8',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#00b4d8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});