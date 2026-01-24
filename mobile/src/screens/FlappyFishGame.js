import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { useGame } from '../context/GameContext';
import { useAds } from '../context/AdsContext';
import { COLORS } from '../constants/config';

import StartScreen from '../components/StartScreen';
import GameOverScreen from '../components/GameOverScreen';
import GameUI from '../components/GameUI';
import BannerAdComponent from '../components/BannerAdComponent';
import Background from '../components/Background';
import GameCanvas from '../components/GameCanvas';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/*
 * GAME HIERARCHY (React Native Implementation):
 * ├── Main Camera (View container)
 * ├── Canvas
 * │   ├── Background
 * │   ├── Player (Fish)
 * │   ├── Spawner (Obstacles)
 * │   ├── GameOverPanel
 * │   │   └── RetryButton
 * │   └── ScoreText (GameUI)
 * └── AdsManager
 *     ├── BannerAd (bottom)
 *     ├── InterstitialAd (every 3 deaths)
 *     └── RewardedAd (revive)
 */

const FlappyFishGame = () => {
  const {
    gameState,
    setGameState,
    score,
    highScore,
    coins,
    canRevive,
    startGame,
    pauseGame,
    gameOver,
    revive,
    addCoins,
    incrementScore,
  } = useGame();

  const {
    onGameOver: onAdsGameOver,
    showRewardedAd,
    hideBanner,
    showBannerAd,
  } = useAds();

  // Manage banner visibility based on game state
  useEffect(() => {
    if (gameState === 'playing') {
      hideBanner();
    } else {
      showBannerAd();
    }
  }, [gameState, hideBanner, showBannerAd]);

  // Handle game start
  const handleStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startGame();
  }, [startGame]);

  // Handle game over
  const handleGameOver = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    gameOver();
    onAdsGameOver(); // Trigger ads manager
  }, [gameOver, onAdsGameOver]);

  // Handle retry (reload scene)
  const handleRetry = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startGame();
  }, [startGame]);

  // Handle revive with rewarded ad
  const handleRevive = useCallback(() => {
    const adShown = showRewardedAd(() => {
      // Reward callback - revive the player
      revive();
    });

    if (!adShown) {
      // If ad not ready, revive anyway (for testing)
      console.log('[Game] Rewarded ad not ready, reviving anyway');
      revive();
    }
  }, [showRewardedAd, revive]);

  // Handle return to menu
  const handleHome = useCallback(() => {
    setGameState('menu');
  }, [setGameState]);

  // Handle score
  const handleScore = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    incrementScore();
  }, [incrementScore]);

  // Handle coin collection
  const handleCoin = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addCoins(1);
  }, [addCoins]);

  // Handle pause
  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  // Open shop (placeholder)
  const handleOpenShop = useCallback(() => {
    console.log('Open Shop');
    // TODO: Implement shop modal
  }, []);

  // Open skins (placeholder)
  const handleOpenSkins = useCallback(() => {
    console.log('Open Skins');
    // TODO: Implement skins modal
  }, []);

  return (
    <View style={styles.container}>
      {/* Background - Always visible */}
      <Background />

      {/* Game Canvas - Only during gameplay */}
      {gameState === 'playing' && (
        <GameCanvas
          onGameOver={handleGameOver}
          onScore={handleScore}
          onCoin={handleCoin}
        />
      )}

      {/* Game UI - Score, Pause button */}
      {gameState === 'playing' && (
        <GameUI
          score={score}
          highScore={highScore}
          coins={coins}
          onPause={handlePause}
        />
      )}

      {/* Start Screen */}
      {gameState === 'menu' && (
        <StartScreen
          onStart={handleStart}
          onOpenShop={handleOpenShop}
          onOpenSkins={handleOpenSkins}
          highScore={highScore}
          coins={coins}
        />
      )}

      {/* Game Over Panel with RetryButton */}
      {gameState === 'gameover' && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          coins={coins}
          isNewHighScore={score >= highScore && score > 0}
          canRevive={canRevive}
          onRetry={handleRetry}
          onRevive={handleRevive}
          onHome={handleHome}
        />
      )}

      {/* Banner Ad - Managed by AdsContext */}
      <BannerAdComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
});

export default FlappyFishGame;
