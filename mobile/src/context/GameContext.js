import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAME_CONFIG } from '../constants/config';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [canRevive, setCanRevive] = useState(true);

  const gameRef = useRef({
    fish: { x: 80, y: 200, velocity: 0, rotation: 0 },
    obstacles: [],
    collectibles: [],
    lastObstacleTime: 0,
  });

  // Load saved data
  React.useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedHighScore = await AsyncStorage.getItem('flappyfish_highscore');
      const savedCoins = await AsyncStorage.getItem('flappyfish_coins');
      if (savedHighScore) setHighScore(parseInt(savedHighScore));
      if (savedCoins) setCoins(parseInt(savedCoins));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = useCallback(async () => {
    try {
      await AsyncStorage.setItem('flappyfish_highscore', highScore.toString());
      await AsyncStorage.setItem('flappyfish_coins', coins.toString());
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [highScore, coins]);

  const resetGame = useCallback(() => {
    gameRef.current = {
      fish: { x: 80, y: 200, velocity: 0, rotation: 0 },
      obstacles: [],
      collectibles: [],
      lastObstacleTime: 0,
    };
    setScore(0);
    setCanRevive(true);
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
      await AsyncStorage.setItem('flappyfish_highscore', score.toString());
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

  const addCoins = useCallback(async (amount) => {
    const newCoins = coins + amount;
    setCoins(newCoins);
    await AsyncStorage.setItem('flappyfish_coins', newCoins.toString());
  }, [coins]);

  const spendCoins = useCallback(async (amount) => {
    if (coins >= amount) {
      const newCoins = coins - amount;
      setCoins(newCoins);
      await AsyncStorage.setItem('flappyfish_coins', newCoins.toString());
      return true;
    }
    return false;
  }, [coins]);

  const flap = useCallback(() => {
    if (gameState === 'playing') {
      gameRef.current.fish.velocity = GAME_CONFIG.FLAP_FORCE;
    }
  }, [gameState]);

  const incrementScore = useCallback(() => {
    setScore((prev) => prev + 1);
  }, []);

  const value = {
    gameState,
    setGameState,
    score,
    setScore,
    highScore,
    coins,
    canRevive,
    gameRef,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    revive,
    addCoins,
    spendCoins,
    flap,
    incrementScore,
    resetGame,
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