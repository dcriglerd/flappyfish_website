import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';

import FlappyFishGame from './src/screens/FlappyFishGame';
import { AdsProvider } from './src/context/AdsContext';
import { GameProvider } from './src/context/GameContext';
import { AudioProvider } from './src/context/AudioContext';
import { PurchasesProvider } from './src/context/PurchasesContext';
import { CloudSyncProvider } from './src/context/CloudSyncContext';
import { AchievementsProvider } from './src/context/AchievementsContext';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initStatus, setInitStatus] = useState('Loading...');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setInitStatus('Initializing ads...');
      
      // Configure ad request settings
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: 'G',
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: ['EMULATOR'],
      });

      // Initialize Google Mobile Ads SDK
      await mobileAds().initialize();
      console.log('[App] Google Mobile Ads SDK initialized');

      setInitStatus('Ready!');
      setIsReady(true);
    } catch (error) {
      console.error('[App] Initialization error:', error);
      // Continue anyway
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🐠 Flappy Fish</Text>
        <Text style={styles.loadingSubtext}>{initStatus}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <CloudSyncProvider>
        <PurchasesProvider>
          <AchievementsProvider>
            <AudioProvider>
              <AdsProvider>
                <GameProvider>
                  <FlappyFishGame />
                </GameProvider>
              </AdsProvider>
            </AudioProvider>
          </AchievementsProvider>
        </PurchasesProvider>
      </CloudSyncProvider>
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
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loadingSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 10,
  },
});
