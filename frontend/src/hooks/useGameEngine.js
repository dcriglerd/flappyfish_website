import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_CONFIG, ENEMIES } from '../data/mockData';

const useGameEngine = (canvasRef) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('flappyfish_highscore') || '0');
  });
  const [coins, setCoins] = useState(() => {
    return parseInt(localStorage.getItem('flappyfish_coins') || '0');
  });
  const [isChasing, setIsChasing] = useState(false);
  const [chaseEnemy, setChaseEnemy] = useState(null);
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [canRevive, setCanRevive] = useState(true);

  const gameRef = useRef({
    fish: { x: 100, y: 300, velocity: 0, rotation: 0 },
    obstacles: [],
    collectibles: [],
    enemy: null,
    lastObstacleTime: 0,
    animationFrame: null,
    bubbles: [],
  });

  const saveProgress = useCallback(() => {
    localStorage.setItem('flappyfish_highscore', highScore.toString());
    localStorage.setItem('flappyfish_coins', coins.toString());
  }, [highScore, coins]);

  useEffect(() => {
    saveProgress();
  }, [coins, highScore, saveProgress]);

  const resetGame = useCallback(() => {
    gameRef.current = {
      fish: { x: 150, y: 400, velocity: 0, rotation: 0 }, // Adjusted for larger canvas (1200x900)
      obstacles: [],
      collectibles: [],
      enemy: null,
      lastObstacleTime: 0, // Will spawn first obstacle after interval
      animationFrame: null,
      bubbles: [],
    };
    setScore(0);
    setIsChasing(false);
    setChaseEnemy(null);
    setActivePowerUp(null);
    setCanRevive(true);
  }, []);

  const flap = useCallback(() => {
    if (gameState === 'playing') {
      gameRef.current.fish.velocity = GAME_CONFIG.flapForce;
    }
  }, [gameState]);

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

  const gameOver = useCallback(() => {
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  const revive = useCallback(() => {
    if (canRevive) {
      setCanRevive(false);
      gameRef.current.fish = { x: 100, y: 300, velocity: 0, rotation: 0 };
      gameRef.current.obstacles = [];
      setGameState('playing');
    }
  }, [canRevive]);

  const addCoins = useCallback((amount) => {
    const multiplier = activePowerUp === 'double_coins' ? 2 : 1;
    setCoins(prev => prev + (amount * multiplier));
  }, [activePowerUp]);

  const spendCoins = useCallback((amount) => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      return true;
    }
    return false;
  }, [coins]);

  const activatePowerUp = useCallback((powerUpId, duration) => {
    setActivePowerUp(powerUpId);
    setTimeout(() => {
      setActivePowerUp(null);
    }, duration);
  }, []);

  const triggerChase = useCallback(() => {
    if (!isChasing && gameState === 'playing') {
      const enemyType = Math.random() < 0.5 ? 'shark' : 'octopus';
      setIsChasing(true);
      setChaseEnemy(enemyType);
      gameRef.current.enemy = {
        type: enemyType,
        x: -100,
        y: gameRef.current.fish.y,
        ...ENEMIES[enemyType],
      };

      setTimeout(() => {
        setIsChasing(false);
        setChaseEnemy(null);
        gameRef.current.enemy = null;
      }, GAME_CONFIG.chaseDuration);
    }
  }, [isChasing, gameState]);

  return {
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
    resetGame,
  };
};

export default useGameEngine;
