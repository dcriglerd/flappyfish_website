import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/config';

const GameUI = ({ 
  score, 
  highScore, 
  coins, 
  coinMultiplier = 1,
  onPause, 
  isMuted, 
  onToggleMute,
  hasShield,
  activePowerUps = {},
}) => {
  // Check which power-ups are active
  const isSlowMotion = activePowerUps?.slow_motion?.active;
  const isMagnetActive = activePowerUps?.magnet?.active;
  const isDoubleCoins = activePowerUps?.double_coins?.active;

  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={styles.topBar}>
        {/* Score */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>🏆</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        {/* Coins with multiplier indicator */}
        <View style={[styles.coinsBox, isDoubleCoins && styles.coinsBoxActive]}>
          <Text style={styles.coinsLabel}>🪙</Text>
          <Text style={styles.coinsValue}>{coins}</Text>
          {coinMultiplier > 1 && (
            <Text style={styles.multiplierBadge}>x{coinMultiplier}</Text>
          )}
        </View>

        {/* Sound Toggle */}
        <TouchableOpacity style={styles.iconButton} onPress={onToggleMute}>
          <Text style={styles.iconText}>{isMuted ? '🔇' : '🔊'}</Text>
        </TouchableOpacity>

        {/* Pause Button */}
        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseText}>⏸</Text>
        </TouchableOpacity>
      </View>

      {/* Active Power-ups indicators */}
      <View style={styles.powerUpIndicators}>
        {hasShield && (
          <View style={[styles.indicator, styles.indicatorShield]}>
            <Text style={styles.indicatorText}>🛡️ Shield</Text>
          </View>
        )}
        {isSlowMotion && (
          <View style={[styles.indicator, styles.indicatorSlow]}>
            <Text style={styles.indicatorText}>⏱️ Slow</Text>
          </View>
        )}
        {isMagnetActive && (
          <View style={[styles.indicator, styles.indicatorMagnet]}>
            <Text style={styles.indicatorText}>🧲 Magnet</Text>
          </View>
        )}
        {isDoubleCoins && (
          <View style={[styles.indicator, styles.indicatorDouble]}>
            <Text style={styles.indicatorText}>💰 x2</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreLabel: {
    fontSize: 18,
    marginRight: 5,
  },
  scoreValue: {
    color: COLORS.WHITE,
    fontSize: 22,
    fontWeight: '900',
  },
  coinsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinsBoxActive: {
    backgroundColor: 'rgba(168,85,247,0.5)',
    borderWidth: 2,
    borderColor: '#a855f7',
  },
  coinsLabel: {
    fontSize: 18,
    marginRight: 5,
  },
  coinsValue: {
    color: COLORS.GOLD,
    fontSize: 20,
    fontWeight: '700',
  },
  multiplierBadge: {
    marginLeft: 6,
    backgroundColor: '#22c55e',
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  pauseButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 20,
  },
  powerUpIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  indicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 2,
  },
  indicatorShield: {
    backgroundColor: 'rgba(100,200,255,0.3)',
    borderColor: 'rgba(100,200,255,0.7)',
  },
  indicatorSlow: {
    backgroundColor: 'rgba(100,149,237,0.3)',
    borderColor: 'rgba(100,149,237,0.7)',
  },
  indicatorMagnet: {
    backgroundColor: 'rgba(168,85,247,0.3)',
    borderColor: 'rgba(168,85,247,0.7)',
  },
  indicatorDouble: {
    backgroundColor: 'rgba(34,197,94,0.3)',
    borderColor: 'rgba(34,197,94,0.7)',
  },
  indicatorText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default GameUI;
