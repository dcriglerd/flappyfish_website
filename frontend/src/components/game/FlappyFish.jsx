import React, { useState, useCallback, useEffect } from 'react';
import useGameEngine from '../../hooks/useGameEngine';
import useGameAudio from '../../hooks/useGameAudio';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import PauseScreen from './PauseScreen';
import ShopModal from './ShopModal';
import SkinsModal from './SkinsModal';
import PowerUpSelector from './PowerUpSelector';
import { FISH_SKINS } from '../../data/mockData';

const FlappyFish = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSkins, setShowSkins] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState(FISH_SKINS[0]);
  const [unlockedSkins, setUnlockedSkins] = useState(['default']);
  const [purchasedPowerUps, setPurchasedPowerUps] = useState([]);

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

  const {
    playFlapSound,
    playScoreSound,
    playCoinSound,
    playGameOverSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    setMuted,
  } = useGameAudio();

  // Handle mute changes
  useEffect(() => {
    setMuted(isMuted);
  }, [isMuted, setMuted]);

  // Start/stop music based on game state
  useEffect(() => {
    if (gameState === 'playing') {
      startBackgroundMusic();
    } else if (gameState === 'gameover') {
      stopBackgroundMusic();
      playGameOverSound();
    }
  }, [gameState, startBackgroundMusic, stopBackgroundMusic, playGameOverSound]);

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

  const handleRestart = useCallback(() => {
    startGame();
    startBackgroundMusic();
  }, [startGame, startBackgroundMusic]);

  const handleHome = useCallback(() => {
    setGameState('menu');
  }, [setGameState]);

  const handleRevive = useCallback(() => {
    // Simulate watching ad
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
      {/* Game Container - 50% larger */}
      <div className="relative w-full h-full flex items-center justify-center" style={{ maxWidth: '1200px', maxHeight: '900px' }}>
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

        {/* Game UI Overlay */}
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
            onRestart={handleRestart}
            onHome={handleHome}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <GameOverScreen
            score={score}
            highScore={highScore}
            coins={coins}
            isNewHighScore={score >= highScore && score > 0}
            canRevive={canRevive}
            onRestart={handleRestart}
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
    </div>
  );
};

export default FlappyFish;
