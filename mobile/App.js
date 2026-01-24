import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

import FlappyFishGame from './src/screens/FlappyFishGame';
import { AdsProvider } from './src/context/AdsContext';
import { GameProvider } from './src/context/GameContext';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simple initialization for Expo Go (no native ads)
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
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
