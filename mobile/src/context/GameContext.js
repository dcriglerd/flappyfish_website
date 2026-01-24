import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_CONFIG } from '../constants/config';
import { FISH_SKINS } from '../data/gameData';

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
  const [activePowerUp, setActivePowerUp] = useState(null);

  const gameRef = useRef({
    fish: { x: 80, y: 200, velocity: 0, rotation: 0 },
    obstacles: [],
    collectibles: [],
    lastObstacleTime: 0,
  });

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

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
    setActivePowerUp(null);
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
    const newCoins = coins + amount;
    setCoins(newCoins);
    await AsyncStorage.setItem(STORAGE_KEYS.COINS, newCoins.toString());
  }, [coins]);

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

  const usePowerUp = useCallback(async (powerUpId) => {
    if (ownedPowerUps[powerUpId] > 0) {
      const newOwnedPowerUps = {
        ...ownedPowerUps,
        [powerUpId]: ownedPowerUps[powerUpId] - 1,
      };
      
      setOwnedPowerUps(newOwnedPowerUps);
      setActivePowerUp(powerUpId);
      
      await AsyncStorage.setItem(STORAGE_KEYS.POWER_UPS, JSON.stringify(newOwnedPowerUps));
      
      return true;
    }
    return false;
  }, [ownedPowerUps]);

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
    
    // Skins
    unlockedSkins,
    selectedSkin,
    unlockSkin,
    selectSkin,
    
    // Power-ups
    ownedPowerUps,
    activePowerUp,
    buyPowerUp,
    usePowerUp,
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
