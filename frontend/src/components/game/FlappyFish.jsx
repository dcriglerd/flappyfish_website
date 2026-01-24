import React, { useState, useCallback, useEffect } from 'react';
import useGameEngine from '../../hooks/useGameEngine';
import useGameAudio from '../../hooks/useGameAudio';
import useAdsManager from '../../hooks/useAdsManager';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import PauseScreen from './PauseScreen';
import ShopModal from './ShopModal';
import SkinsModal from './SkinsModal';
import PowerUpSelector from './PowerUpSelector';
import { BannerAd, InterstitialAd } from './AdsComponents';
import { FISH_SKINS } from '../../data/mockData';

/*
 * GAME HIERARCHY (Unity-style structure):
 * ├── Main Camera (viewport/canvas container)
 * ├── Canvas
 * │   ├── GameOverPanel (GameOverScreen)
 * │   │   └── RetryButton
 * │   └── ScoreText (in GameUI)
 * ├── Player (Flappy Fish - in GameCanvas)
 * ├── Spawner (pipes/obstacles - in GameCanvas)
 * └── AdsManager (useAdsManager hook)
 */

const FlappyFish = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSkins, setShowSkins] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState(FISH_SKINS[0]);
  const [unlockedSkins, setUnlockedSkins] = useState(['default']);
  const [purchasedPowerUps, setPurchasedPowerUps] = useState([]);

  // Game Engine (Player, Spawner logic)
  const {
    gameState,
    setGameState,
    score,
    setScore,
    highScore,
    coins,
    isChasing,
    chaseEnemy,
    activePowerUp,
    canRevive,
    gameRef,
    flap,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    revive,
    addCoins,
    spendCoins,
    activatePowerUp,
    triggerChase,
  } = useGameEngine();

  // Audio Manager
  const {
    playFlapSound,
    playScoreSound,
    playCoinSound,
    playGameOverSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    setMuted,
  } = useGameAudio();

  // ADS MANAGER - handles banner and interstitial ads
  const {
    showBanner,
    showInterstitial,
    adsRemoved,
    onGameOver: onAdsGameOver,
    closeInterstitial,
    removeAds,
    hideBanner,
    showBannerAd,
  } = useAdsManager();

  // Handle mute changes
  useEffect(() => {
    setMuted(isMuted);
  }, [isMuted, setMuted]);

  // Game state changes - manage music and ads
  useEffect(() => {
    if (gameState === 'playing') {
      startBackgroundMusic();
      hideBanner(); // Hide banner during gameplay
    } else if (gameState === 'gameover') {
      stopBackgroundMusic();
      playGameOverSound();
      onAdsGameOver(); // Trigger ads manager on game over
      showBannerAd(); // Show banner on game over
    } else if (gameState === 'menu') {
      showBannerAd(); // Show banner on menu
    }
  }, [gameState, startBackgroundMusic, stopBackgroundMusic, playGameOverSound, onAdsGameOver, hideBanner, showBannerAd]);

  const handleStartGame = useCallback(() => {
    startGame();
    startBackgroundMusic();
  }, [startGame, startBackgroundMusic]);

  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  const handleResume = useCallback(() => {
    resumeGame();
  }, [resumeGame]);

  // RETRY - Reload scene equivalent (restart game)
  const handleRetry = useCallback(() => {
    startGame();
    startBackgroundMusic();
  }, [startGame, startBackgroundMusic]);

  const handleHome = useCallback(() => {
    setGameState('menu');
  }, [setGameState]);

  const handleRevive = useCallback(() => {
    // Simulate watching rewarded ad
    setTimeout(() => {
      revive();
    }, 500);
  }, [revive]);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handlePurchaseCoins = useCallback((amount) => {
    addCoins(amount);
  }, [addCoins]);

  const handleBuyPowerUp = useCallback((powerUp) => {
    if (spendCoins(powerUp.cost)) {
      setPurchasedPowerUps(prev => [...prev, powerUp]);
    }
  }, [spendCoins]);

  const handleUsePowerUp = useCallback((powerUp) => {
    setPurchasedPowerUps(prev => {
      const index = prev.findIndex(p => p.id === powerUp.id);
      if (index !== -1) {
        const newPowerUps = [...prev];
        newPowerUps.splice(index, 1);
        activatePowerUp(powerUp.id, powerUp.duration);
        return newPowerUps;
      }
      return prev;
    });
  }, [activatePowerUp]);

  const handleUnlockSkin = useCallback((skin) => {
    if (spendCoins(skin.cost)) {
      setUnlockedSkins(prev => [...prev, skin.id]);
    }
  }, [spendCoins]);

  const handleSelectSkin = useCallback((skin) => {
    setSelectedSkin(skin);
  }, []);

  // Handle remove ads purchase
  const handleRemoveAds = useCallback(() => {
    removeAds();
  }, [removeAds]);

  // Flap with sound
  const handleFlap = useCallback(() => {
    flap();
    playFlapSound();
  }, [flap, playFlapSound]);

  // Coin collect with sound
  const handleCoinCollect = useCallback((amount) => {
    addCoins(amount);
    playCoinSound();
  }, [addCoins, playCoinSound]);

  // Score update with sound
  const handleScoreUpdate = useCallback((updater) => {
    setScore(updater);
    playScoreSound();
  }, [setScore, playScoreSound]);

  return (
    <div className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(180deg, #00d4ff 0%, #00b4d8 30%, #0096c7 60%, #0077b6 100%)' }}>
      
      {/* ============================================
          MAIN CAMERA / CANVAS CONTAINER
          ============================================ */}
      <div className="relative w-full h-full flex items-center justify-center" style={{ maxWidth: '600px', maxHeight: '450px' }}>
        
        {/* ============================================
            GAME CANVAS - Contains Player & Spawner
            ============================================ */}
        <GameCanvas
          gameState={gameState}
          gameRef={gameRef}
          onFlap={handleFlap}
          onScoreUpdate={handleScoreUpdate}
          onCoinCollect={handleCoinCollect}
          onGameOver={gameOver}
          onTriggerChase={triggerChase}
          isChasing={isChasing}
          activePowerUp={activePowerUp}
          selectedSkin={selectedSkin}
        />

        {/* ============================================
            UI CANVAS - ScoreText, Buttons
            ============================================ */}
        {gameState === 'playing' && (
          <>
            <GameUI
              score={score}
              highScore={highScore}
              coins={coins}
              gameState={gameState}
              isChasing={isChasing}
              chaseEnemy={chaseEnemy}
              activePowerUp={activePowerUp}
              onPause={handlePause}
              onResume={handleResume}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />
            <PowerUpSelector
              availablePowerUps={purchasedPowerUps}
              onUsePowerUp={handleUsePowerUp}
              gameCoins={coins}
            />
          </>
        )}

        {/* Start Screen */}
        {gameState === 'menu' && (
          <StartScreen
            onStart={handleStartGame}
            onOpenShop={() => setShowShop(true)}
            onOpenSkins={() => setShowSkins(true)}
            highScore={highScore}
            coins={coins}
          />
        )}

        {/* Pause Screen */}
        {gameState === 'paused' && (
          <PauseScreen
            onResume={handleResume}
            onRestart={handleRetry}
            onHome={handleHome}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* ============================================
            GAME OVER PANEL - with RetryButton
            ============================================ */}
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

        {/* Shop Modal */}
        <ShopModal
          isOpen={showShop}
          onClose={() => setShowShop(false)}
          coins={coins}
          onPurchase={handlePurchaseCoins}
          onBuyPowerUp={handleBuyPowerUp}
          onRemoveAds={handleRemoveAds}
          adsRemoved={adsRemoved}
        />

        {/* Skins Modal */}
        <SkinsModal
          isOpen={showSkins}
          onClose={() => setShowSkins(false)}
          coins={coins}
          selectedSkin={selectedSkin}
          onSelectSkin={handleSelectSkin}
          onUnlockSkin={handleUnlockSkin}
          unlockedSkins={unlockedSkins}
        />
      </div>

      {/* ============================================
          ADS MANAGER - Banner & Interstitial Ads
          ============================================ */}
      <BannerAd show={showBanner} />
      <InterstitialAd show={showInterstitial} onClose={closeInterstitial} />
      
    </div>
  );
};

export default FlappyFish;
