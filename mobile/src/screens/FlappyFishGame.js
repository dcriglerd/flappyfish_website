import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
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
    onAdsGameOver();
  }, [gameOver, onAdsGameOver]);

  // Handle retry
  const handleRetry = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startGame();
  }, [startGame]);

  // Handle revive with rewarded ad
  const handleRevive = useCallback(() => {
    showRewardedAd(() => {
      revive();
    });
  }, [showRewardedAd, revive]);

  // Handle return to menu
  const handleHome = useCallback(() => {
    setGameState('menu');
  }, [setGameState]);

  // Handle score
  const handleScore = useCallback(() => {
    incrementScore();
  }, [incrementScore]);

  // Handle coin collection
  const handleCoin = useCallback(() => {
    addCoins(1);
  }, [addCoins]);

  // Handle pause
  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  // Placeholder shop/skins handlers
  const handleOpenShop = useCallback(() => {
    console.log('Shop - Coming soon!');
  }, []);

  const handleOpenSkins = useCallback(() => {
    console.log('Skins - Coming soon!');
  }, []);

  return (
    <View style={styles.container}>
      {/* Background - Always visible */}
      <Background />

      {/* Game Canvas - Only during gameplay */}
      <GameCanvas
        onGameOver={handleGameOver}
        onScore={handleScore}
        onCoin={handleCoin}
      />

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

      {/* Game Over Panel */}
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
