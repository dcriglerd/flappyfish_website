import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_CONFIG } from '../constants/config';
import { FISH_SKINS, POWER_UPS } from '../data/gameData';

const GameContext = createContext();

const STORAGE_KEYS = {
  HIGH_SCORE: 'flappyfish_highscore',
  COINS: 'flappyfish_coins',
  UNLOCKED_SKINS: 'flappyfish_unlockedskins',
  SELECTED_SKIN: 'flappyfish_selectedskin',
  POWER_UPS: 'flappyfish_powerups',
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [canRevive, setCanRevive] = useState(true);
  
  // Skins state
  const [unlockedSkins, setUnlockedSkins] = useState(['default']);
  const [selectedSkin, setSelectedSkin] = useState(FISH_SKINS[0]);
  
  // Power-ups state
  const [ownedPowerUps, setOwnedPowerUps] = useState({});
  // Active power-ups: { powerUpId: { active: boolean, endTime: timestamp } }
  const [activePowerUps, setActivePowerUps] = useState({});
  
  // Shield state (consumed on hit)
  const [hasShield, setHasShield] = useState(false);
  
  // Double coins multiplier
  const [coinMultiplier, setCoinMultiplier] = useState(1);

  const gameRef = useRef({
    fish: { x: 80, y: 200, velocity: 0, rotation: 0 },
    obstacles: [],
    collectibles: [],
    lastObstacleTime: 0,
  });
  
  const powerUpTimersRef = useRef({});

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Clear power-up timers on unmount or game end
  useEffect(() => {
    if (gameState === 'gameover' || gameState === 'menu') {
      // Clear all active power-ups
      Object.values(powerUpTimersRef.current).forEach(timer => clearTimeout(timer));
      powerUpTimersRef.current = {};
      setActivePowerUps({});
      setHasShield(false);
      setCoinMultiplier(1);
    }
  }, [gameState]);

  const loadSavedData = async () => {
    try {
      const [savedHighScore, savedCoins, savedUnlockedSkins, savedSelectedSkin, savedPowerUps] = 
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
          AsyncStorage.getItem(STORAGE_KEYS.COINS),
          AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_SKINS),
          AsyncStorage.getItem(STORAGE_KEYS.SELECTED_SKIN),
          AsyncStorage.getItem(STORAGE_KEYS.POWER_UPS),
        ]);

      if (savedHighScore) setHighScore(parseInt(savedHighScore));
      if (savedCoins) setCoins(parseInt(savedCoins));
      
      if (savedUnlockedSkins) {
        const skins = JSON.parse(savedUnlockedSkins);
        setUnlockedSkins(skins);
      }
      
      if (savedSelectedSkin) {
        const skinId = savedSelectedSkin;
        const skin = FISH_SKINS.find(s => s.id === skinId) || FISH_SKINS[0];
        setSelectedSkin(skin);
      }
      
      if (savedPowerUps) {
        setOwnedPowerUps(JSON.parse(savedPowerUps));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const resetGame = useCallback(() => {
    gameRef.current = {
      fish: { x: 80, y: 200, velocity: 0, rotation: 0 },
      obstacles: [],
      collectibles: [],
      lastObstacleTime: 0,
    };
    setScore(0);
    setCanRevive(true);
    // Clear power-ups on reset
    Object.values(powerUpTimersRef.current).forEach(timer => clearTimeout(timer));
    powerUpTimersRef.current = {};
    setActivePowerUps({});
    setHasShield(false);
    setCoinMultiplier(1);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameState('playing');
  }, [resetGame]);

  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
    }
  }, [gameState]);

  const resumeGame = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  const gameOver = useCallback(async () => {
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    }
  }, [score, highScore]);

  const revive = useCallback(() => {
    if (canRevive) {
      setCanRevive(false);
      gameRef.current.fish = { x: 80, y: 200, velocity: 0, rotation: 0 };
      gameRef.current.obstacles = [];
      setGameState('playing');
    }
  }, [canRevive]);

  // Coins management
  const addCoins = useCallback(async (amount) => {
    const actualAmount = amount * coinMultiplier;
    const newCoins = coins + actualAmount;
    setCoins(newCoins);
    await AsyncStorage.setItem(STORAGE_KEYS.COINS, newCoins.toString());
    return actualAmount; // Return actual amount earned (for UI feedback)
  }, [coins, coinMultiplier]);

  const spendCoins = useCallback(async (amount) => {
    if (coins >= amount) {
      const newCoins = coins - amount;
      setCoins(newCoins);
      await AsyncStorage.setItem(STORAGE_KEYS.COINS, newCoins.toString());
      return true;
    }
    return false;
  }, [coins]);

  // Skins management
  const unlockSkin = useCallback(async (skin) => {
    if (coins >= skin.cost && !unlockedSkins.includes(skin.id)) {
      const newCoins = coins - skin.cost;
      const newUnlockedSkins = [...unlockedSkins, skin.id];
      
      setCoins(newCoins);
      setUnlockedSkins(newUnlockedSkins);
      
      await AsyncStorage.setItem(STORAGE_KEYS.COINS, newCoins.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_SKINS, JSON.stringify(newUnlockedSkins));
      
      return true;
    }
    return false;
  }, [coins, unlockedSkins]);

  const selectSkin = useCallback(async (skin) => {
    if (unlockedSkins.includes(skin.id)) {
      setSelectedSkin(skin);
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_SKIN, skin.id);
    }
  }, [unlockedSkins]);

  // Power-ups management
  const buyPowerUp = useCallback(async (powerUp) => {
    if (coins >= powerUp.cost) {
      const newCoins = coins - powerUp.cost;
      const newOwnedPowerUps = {
        ...ownedPowerUps,
        [powerUp.id]: (ownedPowerUps[powerUp.id] || 0) + 1,
      };
      
      setCoins(newCoins);
      setOwnedPowerUps(newOwnedPowerUps);
      
      await AsyncStorage.setItem(STORAGE_KEYS.COINS, newCoins.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.POWER_UPS, JSON.stringify(newOwnedPowerUps));
      
      return true;
    }
    return false;
  }, [coins, ownedPowerUps]);

  // Activate a power-up during gameplay
  const activatePowerUp = useCallback(async (powerUpId) => {
    if ((ownedPowerUps[powerUpId] || 0) <= 0) return false;
    if (activePowerUps[powerUpId]?.active) return false; // Already active
    
    const powerUp = POWER_UPS.find(p => p.id === powerUpId);
    if (!powerUp) return false;

    // Deduct from inventory
    const newOwnedPowerUps = {
      ...ownedPowerUps,
      [powerUpId]: ownedPowerUps[powerUpId] - 1,
    };
    setOwnedPowerUps(newOwnedPowerUps);
    await AsyncStorage.setItem(STORAGE_KEYS.POWER_UPS, JSON.stringify(newOwnedPowerUps));

    // Activate the power-up
    const endTime = Date.now() + powerUp.duration;
    setActivePowerUps(prev => ({
      ...prev,
      [powerUpId]: { active: true, endTime },
    }));

    // Apply effect
    switch (powerUpId) {
      case 'bubble_shield':
        setHasShield(true);
        break;
      case 'double_coins':
        setCoinMultiplier(2);
        break;
      // slow_motion and magnet are handled in GameCanvas
    }

    // Set timer to deactivate
    powerUpTimersRef.current[powerUpId] = setTimeout(() => {
      setActivePowerUps(prev => ({
        ...prev,
        [powerUpId]: { active: false, endTime: 0 },
      }));
      
      // Remove effect
      switch (powerUpId) {
        case 'bubble_shield':
          setHasShield(false);
          break;
        case 'double_coins':
          setCoinMultiplier(1);
          break;
      }
    }, powerUp.duration);

    console.log(`[PowerUp] Activated ${powerUpId} for ${powerUp.duration}ms`);
    return true;
  }, [ownedPowerUps, activePowerUps]);

  // Consume shield (called when player would die but has shield)
  const consumeShield = useCallback(() => {
    if (hasShield) {
      setHasShield(false);
      // Also mark shield power-up as inactive
      setActivePowerUps(prev => ({
        ...prev,
        bubble_shield: { active: false, endTime: 0 },
      }));
      // Clear the timer
      if (powerUpTimersRef.current.bubble_shield) {
        clearTimeout(powerUpTimersRef.current.bubble_shield);
        delete powerUpTimersRef.current.bubble_shield;
      }
      return true; // Shield was consumed
    }
    return false; // No shield
  }, [hasShield]);

  const flap = useCallback(() => {
    if (gameState === 'playing') {
      gameRef.current.fish.velocity = GAME_CONFIG.FLAP_FORCE;
    }
  }, [gameState]);

  const incrementScore = useCallback(() => {
    setScore((prev) => prev + 1);
  }, []);

  const value = {
    // Game state
    gameState,
    setGameState,
    score,
    setScore,
    highScore,
    coins,
    canRevive,
    gameRef,
    
    // Game actions
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    revive,
    flap,
    incrementScore,
    resetGame,
    
    // Coins
    addCoins,
    spendCoins,
    coinMultiplier,
    
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
    
    // Shield
    hasShield,
    consumeShield,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
