import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { useGame } from '../context/GameContext';
import { useAds } from '../context/AdsContext';
import { useAudio } from '../context/AudioContext';
import { COLORS } from '../constants/config';

import StartScreen from '../components/StartScreen';
import GameOverScreen from '../components/GameOverScreen';
import GameUI from '../components/GameUI';
import BannerAdComponent from '../components/BannerAdComponent';
import Background from '../components/Background';
import GameCanvas from '../components/GameCanvas';
import ShopModal from '../components/ShopModal';
import SkinsModal from '../components/SkinsModal';
import PowerUpBar from '../components/PowerUpBar';

const FlappyFishGame = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSkins, setShowSkins] = useState(false);
  
  const {
    gameState,
    setGameState,
    score,
    highScore,
    coins,
    canRevive,
    coinMultiplier,
    startGame,
    pauseGame,
    gameOver,
    revive,
    addCoins,
    incrementScore,
    // Skins
    unlockedSkins,
    selectedSkin,
    unlockSkin,
    selectSkin,
    // Power-ups
    ownedPowerUps,
    activePowerUps,
    buyPowerUp,
    activatePowerUp,
    hasShield,
  } = useGame();

  const {
    onGameOver: onAdsGameOver,
    showRewardedAd,
    hideBanner,
    showBannerAd,
    removeAds,
    adsRemoved,
  } = useAds();

  const {
    playFlapSound,
    playScoreSound,
    playCoinSound,
    playGameOverSound,
    setMuted,
  } = useAudio();

  // Sync mute state with audio hook
  useEffect(() => {
    setMuted(isMuted);
  }, [isMuted, setMuted]);

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
    playGameOverSound();
    gameOver();
    onAdsGameOver();
  }, [gameOver, onAdsGameOver, playGameOverSound]);

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

  // Handle score with sound
  const handleScore = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playScoreSound();
    incrementScore();
  }, [incrementScore, playScoreSound]);

  // Handle coin collection with sound
  const handleCoin = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playCoinSound();
    addCoins(1);
  }, [addCoins, playCoinSound]);

  // Handle flap with sound
  const handleFlap = useCallback(() => {
    playFlapSound();
  }, [playFlapSound]);

  // Handle shield hit (saved by shield)
  const handleShieldHit = useCallback(() => {
    // Could play a special sound here
    console.log('[Game] Shield absorbed hit!');
  }, []);

  // Handle pause
  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  // Toggle mute
  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Shop handlers
  const handleOpenShop = useCallback(() => {
    setShowShop(true);
  }, []);

  const handleCloseShop = useCallback(() => {
    setShowShop(false);
  }, []);

  const handlePurchaseCoins = useCallback((amount) => {
    addCoins(amount);
  }, [addCoins]);

  const handleBuyPowerUp = useCallback((powerUp) => {
    buyPowerUp(powerUp);
  }, [buyPowerUp]);

  const handleRemoveAds = useCallback(() => {
    removeAds();
  }, [removeAds]);

  // Skins handlers
  const handleOpenSkins = useCallback(() => {
    setShowSkins(true);
  }, []);

  const handleCloseSkins = useCallback(() => {
    setShowSkins(false);
  }, []);

  const handleSelectSkin = useCallback((skin) => {
    selectSkin(skin);
  }, [selectSkin]);

  const handleUnlockSkin = useCallback((skin) => {
    unlockSkin(skin);
  }, [unlockSkin]);

  // Power-up activation during gameplay
  const handleActivatePowerUp = useCallback((powerUpId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    activatePowerUp(powerUpId);
  }, [activatePowerUp]);

  return (
    <View style={styles.container}>
      {/* Background - Always visible */}
      <Background />

      {/* Game Canvas - Only during gameplay */}
      <GameCanvas
        onGameOver={handleGameOver}
        onScore={handleScore}
        onCoin={handleCoin}
        onFlap={handleFlap}
        onShieldHit={handleShieldHit}
        selectedSkin={selectedSkin}
      />

      {/* Game UI - Score, Pause button */}
      {gameState === 'playing' && (
        <GameUI
          score={score}
          highScore={highScore}
          coins={coins}
          coinMultiplier={coinMultiplier}
          onPause={handlePause}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          hasShield={hasShield}
          activePowerUps={activePowerUps}
        />
      )}

      {/* Power-up bar during gameplay */}
      {gameState === 'playing' && (
        <PowerUpBar
          ownedPowerUps={ownedPowerUps}
          activePowerUps={activePowerUps}
          onActivatePowerUp={handleActivatePowerUp}
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
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          selectedSkin={selectedSkin}
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

      {/* Shop Modal */}
      <ShopModal
        visible={showShop}
        onClose={handleCloseShop}
        coins={coins}
        onPurchaseCoins={handlePurchaseCoins}
        onBuyPowerUp={handleBuyPowerUp}
        onRemoveAds={handleRemoveAds}
        adsRemoved={adsRemoved}
      />

      {/* Skins Modal */}
      <SkinsModal
        visible={showSkins}
        onClose={handleCloseSkins}
        coins={coins}
        selectedSkin={selectedSkin}
        unlockedSkins={unlockedSkins}
        onSelectSkin={handleSelectSkin}
        onUnlockSkin={handleUnlockSkin}
      />
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
