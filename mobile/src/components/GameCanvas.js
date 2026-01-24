import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { useGame } from '../context/GameContext';
import { useAds } from '../context/AdsContext';
import { GAME_CONFIG, COLORS } from '../constants/config';

import Fish from './Fish';
import Obstacle from './Obstacle';
import Background from './Background';
import Coin from './Coin';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Game Systems
const Physics = (entities, { time, dispatch }) => {
  const fish = entities.fish;
  
  if (!fish) return entities;

  // Apply gravity
  fish.velocity += GAME_CONFIG.GRAVITY;
  fish.position.y += fish.velocity;
  fish.rotation = Math.min(90, Math.max(-30, fish.velocity * 5));

  // Check boundaries
  if (fish.position.y < 0 || fish.position.y > SCREEN_HEIGHT - 100) {
    dispatch({ type: 'game-over' });
  }

  return entities;
};

const ObstacleSpawner = (entities, { time, dispatch }) => {
  const now = Date.now();
  
  if (!entities.spawner) {
    entities.spawner = { lastSpawn: now };
  }

  if (now - entities.spawner.lastSpawn > GAME_CONFIG.OBSTACLE_INTERVAL) {
    const gapY = 100 + Math.random() * (SCREEN_HEIGHT - 350);
    const obstacleId = `obstacle_${now}`;
    
    entities[obstacleId] = {
      position: { x: SCREEN_WIDTH, gapY },
      type: 'obstacle',
      scored: false,
      renderer: Obstacle,
    };

    // Spawn coin in gap
    if (Math.random() < 0.7) {
      entities[`coin_${now}`] = {
        position: { x: SCREEN_WIDTH + 35, y: gapY },
        type: 'coin',
        renderer: Coin,
      };
    }

    entities.spawner.lastSpawn = now;
  }

  return entities;
};

const ObstacleMovement = (entities, { dispatch }) => {
  Object.keys(entities).forEach((key) => {
    if (key.startsWith('obstacle_') || key.startsWith('coin_')) {
      const entity = entities[key];
      entity.position.x -= GAME_CONFIG.OBSTACLE_SPEED;

      // Remove off-screen entities
      if (entity.position.x < -100) {
        delete entities[key];
      }

      // Score check for obstacles
      if (key.startsWith('obstacle_') && !entity.scored) {
        if (entity.position.x + 70 < entities.fish.position.x) {
          entity.scored = true;
          dispatch({ type: 'score' });
        }
      }
    }
  });

  return entities;
};

const CollisionDetection = (entities, { dispatch }) => {
  const fish = entities.fish;
  if (!fish) return entities;

  const fishLeft = fish.position.x - 20;
  const fishRight = fish.position.x + 20;
  const fishTop = fish.position.y - 15;
  const fishBottom = fish.position.y + 15;

  Object.keys(entities).forEach((key) => {
    if (key.startsWith('obstacle_')) {
      const obs = entities[key];
      const obsLeft = obs.position.x;
      const obsRight = obs.position.x + 70;
      const gapTop = obs.position.gapY - GAME_CONFIG.GAP_HEIGHT / 2;
      const gapBottom = obs.position.gapY + GAME_CONFIG.GAP_HEIGHT / 2;

      if (fishRight > obsLeft && fishLeft < obsRight) {
        if (fishTop < gapTop || fishBottom > gapBottom) {
          dispatch({ type: 'game-over' });
        }
      }
    }

    // Coin collection
    if (key.startsWith('coin_')) {
      const coin = entities[key];
      const dx = fish.position.x - coin.position.x;
      const dy = fish.position.y - coin.position.y;
      if (Math.sqrt(dx * dx + dy * dy) < 30) {
        dispatch({ type: 'coin' });
        delete entities[key];
      }
    }
  });

  return entities;
};

const GameCanvas = ({ onGameOver, onScore, onCoin }) => {
  const { gameState, flap, gameRef } = useGame();
  const engineRef = useRef(null);

  const initialEntities = {
    fish: {
      position: { x: 80, y: 200 },
      velocity: 0,
      rotation: 0,
      renderer: Fish,
    },
    background: {
      renderer: Background,
    },
    spawner: {
      lastSpawn: 0,
    },
  };

  const onEvent = useCallback((e) => {
    if (e.type === 'game-over') {
      onGameOver && onGameOver();
    } else if (e.type === 'score') {
      onScore && onScore();
    } else if (e.type === 'coin') {
      onCoin && onCoin();
    }
  }, [onGameOver, onScore, onCoin]);

  const handleTouch = useCallback(() => {
    if (gameState === 'playing' && engineRef.current) {
      // Apply flap to fish entity
      const entities = engineRef.current.state.entities;
      if (entities && entities.fish) {
        entities.fish.velocity = GAME_CONFIG.FLAP_FORCE;
      }
    }
  }, [gameState]);

  if (gameState !== 'playing') {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={styles.container}>
        <GameEngine
          ref={engineRef}
          style={styles.gameEngine}
          systems={[Physics, ObstacleSpawner, ObstacleMovement, CollisionDetection]}
          entities={initialEntities}
          onEvent={onEvent}
          running={gameState === 'playing'}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameEngine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default GameCanvas;