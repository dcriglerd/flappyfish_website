import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useGame } from '../context/GameContext';
import { GAME_CONFIG } from '../constants/config';

import Fish from './Fish';
import Obstacle from './Obstacle';
import Coin from './Coin';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GameCanvas = ({ onGameOver, onScore, onCoin, onFlap, selectedSkin, onShieldHit }) => {
  const { gameState, activePowerUps, hasShield, consumeShield } = useGame();
  const animationRef = useRef(null);
  
  const [fish, setFish] = useState({ x: 80, y: SCREEN_HEIGHT / 3, velocity: 0, rotation: 0 });
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const lastSpawnRef = useRef(0);
  const gameOverCalledRef = useRef(false);

  // Check if power-ups are active
  const isSlowMotion = activePowerUps?.slow_motion?.active;
  const isMagnetActive = activePowerUps?.magnet?.active;

  // Speed modifier for slow motion
  const speedMultiplier = isSlowMotion ? 0.5 : 1;

  // Reset game state when starting
  useEffect(() => {
    if (gameState === 'playing') {
      setFish({ x: 80, y: SCREEN_HEIGHT / 3, velocity: 0, rotation: 0 });
      setObstacles([]);
      setCoins([]);
      lastSpawnRef.current = Date.now();
      gameOverCalledRef.current = false;
    }
  }, [gameState]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const gameLoop = () => {
      if (gameOverCalledRef.current) return;
      
      const now = Date.now();
      
      setFish(prevFish => {
        const newVelocity = prevFish.velocity + (GAME_CONFIG.GRAVITY * speedMultiplier);
        const newY = prevFish.y + newVelocity;
        const newRotation = Math.min(90, Math.max(-30, newVelocity * 5));

        // Check boundaries
        if ((newY < 20 || newY > SCREEN_HEIGHT - 80) && !gameOverCalledRef.current) {
          // Check for shield
          if (hasShield) {
            consumeShield();
            onShieldHit && onShieldHit();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            // Reset fish position safely
            return {
              ...prevFish,
              y: Math.max(50, Math.min(newY, SCREEN_HEIGHT - 100)),
              velocity: GAME_CONFIG.FLAP_FORCE,
            };
          }
          gameOverCalledRef.current = true;
          setTimeout(() => onGameOver && onGameOver(), 0);
          return prevFish;
        }

        return {
          ...prevFish,
          y: newY,
          velocity: newVelocity,
          rotation: newRotation,
        };
      });

      // Spawn obstacles (slower spawn in slow motion)
      const spawnInterval = GAME_CONFIG.OBSTACLE_INTERVAL / speedMultiplier;
      if (now - lastSpawnRef.current > spawnInterval) {
        const gapY = 120 + Math.random() * (SCREEN_HEIGHT - 340);
        const newObstacle = {
          id: `obs_${now}`,
          x: SCREEN_WIDTH,
          gapY,
          scored: false,
        };
        
        setObstacles(prev => [...prev, newObstacle]);
        
        // Spawn coin in gap (70% chance)
        if (Math.random() < 0.7) {
          setCoins(prev => [...prev, {
            id: `coin_${now}`,
            x: SCREEN_WIDTH + 35,
            y: gapY,
          }]);
        }
        
        lastSpawnRef.current = now;
      }

      // Move obstacles (with speed modifier)
      setObstacles(prev => {
        return prev.map(obs => ({
          ...obs,
          x: obs.x - (GAME_CONFIG.OBSTACLE_SPEED * speedMultiplier),
        })).filter(obs => obs.x > -100);
      });

      // Move coins (with speed modifier + magnet effect)
      setCoins(prev => {
        return prev.map(coin => {
          let newX = coin.x - (GAME_CONFIG.OBSTACLE_SPEED * speedMultiplier);
          let newY = coin.y;

          // Magnet effect: attract coins toward fish
          if (isMagnetActive) {
            setFish(currentFish => {
              const dx = currentFish.x - coin.x;
              const dy = currentFish.y - coin.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 150 && distance > 0) {
                // Move coin toward fish
                const magnetForce = 3;
                newX += (dx / distance) * magnetForce;
                newY += (dy / distance) * magnetForce;
              }
              return currentFish;
            });
          }

          return {
            ...coin,
            x: newX,
            y: newY,
          };
        }).filter(coin => coin.x > -50);
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, speedMultiplier, isMagnetActive, hasShield, consumeShield, onGameOver, onShieldHit]);

  // Collision detection in separate effect
  useEffect(() => {
    if (gameState !== 'playing' || gameOverCalledRef.current) return;

    const fishLeft = fish.x - 20;
    const fishRight = fish.x + 20;
    const fishTop = fish.y - 15;
    const fishBottom = fish.y + 15;

    // Check obstacle collisions
    for (const obs of obstacles) {
      const obsLeft = obs.x;
      const obsRight = obs.x + 70;
      const gapTop = obs.gapY - GAME_CONFIG.GAP_HEIGHT / 2;
      const gapBottom = obs.gapY + GAME_CONFIG.GAP_HEIGHT / 2;

      if (fishRight > obsLeft && fishLeft < obsRight) {
        if (fishTop < gapTop || fishBottom > gapBottom) {
          // Check for shield before game over
          if (hasShield) {
            consumeShield();
            onShieldHit && onShieldHit();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            // Remove the obstacle that was hit
            setObstacles(prev => prev.filter(o => o.id !== obs.id));
            return;
          }
          
          if (!gameOverCalledRef.current) {
            gameOverCalledRef.current = true;
            onGameOver && onGameOver();
          }
          return;
        }
      }

      // Score when passing obstacle
      if (!obs.scored && obs.x + 70 < fish.x) {
        obs.scored = true;
        onScore && onScore();
      }
    }

    // Check coin collisions (larger radius with magnet)
    const coinCollectRadius = isMagnetActive ? 50 : 35;
    setCoins(prev => {
      return prev.filter(coin => {
        const dx = fish.x - coin.x;
        const dy = fish.y - coin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < coinCollectRadius) {
          onCoin && onCoin();
          return false;
        }
        return true;
      });
    });
  }, [fish, obstacles, gameState, onGameOver, onScore, onCoin, hasShield, consumeShield, onShieldHit, isMagnetActive]);

  // Handle tap to flap
  const handleTap = useCallback(() => {
    if (gameState === 'playing' && !gameOverCalledRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onFlap && onFlap(); // Play flap sound
      setFish(prev => ({
        ...prev,
        velocity: GAME_CONFIG.FLAP_FORCE,
      }));
    }
  }, [gameState, onFlap]);

  if (gameState !== 'playing') {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        {/* Slow motion overlay */}
        {isSlowMotion && <View style={styles.slowMotionOverlay} />}
        
        {/* Render obstacles */}
        {obstacles.map(obs => (
          <Obstacle key={obs.id} position={{ x: obs.x, gapY: obs.gapY }} />
        ))}
        
        {/* Render coins */}
        {coins.map(coin => (
          <Coin 
            key={coin.id} 
            position={{ x: coin.x, y: coin.y }} 
            isMagnetized={isMagnetActive}
          />
        ))}
        
        {/* Render fish */}
        <Fish 
          position={{ x: fish.x, y: fish.y }} 
          rotation={fish.rotation} 
          skinColor={selectedSkin?.color}
          hasShield={hasShield}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  slowMotionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(100, 149, 237, 0.15)',
  },
});

export default GameCanvas;
