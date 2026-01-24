import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';

import FlappyFishGame from './src/screens/FlappyFishGame';
import { AdsProvider } from './src/context/AdsContext';
import { GameProvider } from './src/context/GameContext';
import { AudioProvider } from './src/context/AudioContext';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Configure request settings
      await mobileAds().setRequestConfiguration({
        // Maximum ad content rating (G = General audiences)
        maxAdContentRating: 'G',
        // Tag for child-directed treatment
        tagForChildDirectedTreatment: false,
        // Tag for users under age of consent
        tagForUnderAgeOfConsent: false,
        // Test device identifiers - 'EMULATOR' works for all emulators/simulators
        testDeviceIdentifiers: ['EMULATOR'],
      });

      console.log('[App] Request configuration set');

      // Initialize Google Mobile Ads SDK
      const adapterStatuses = await mobileAds().initialize();
      console.log('[App] Google Mobile Ads SDK initialized');
      console.log('[App] Adapter statuses:', JSON.stringify(adapterStatuses, null, 2));

      setIsReady(true);
    } catch (error) {
      console.error('[App] Initialization error:', error);
      setInitError(error.message);
      // Continue anyway - ads will just not work
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🐠 Loading...</Text>
        <Text style={styles.loadingSubtext}>Initializing ads...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <AudioProvider>
        <AdsProvider>
          <GameProvider>
            <FlappyFishGame />
          </GameProvider>
        </AdsProvider>
      </AudioProvider>
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
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loadingSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 10,
  },
});
