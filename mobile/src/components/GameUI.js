import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/config';

const GameUI = ({ score, highScore, coins, onPause }) => {
  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={styles.topBar}>
        {/* Score */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>🏆</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        {/* Coins */}
        <View style={styles.coinsBox}>
          <Text style={styles.coinsLabel}>🪙</Text>
          <Text style={styles.coinsValue}>{coins}</Text>
        </View>

        {/* Pause Button */}
        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseText}>||</Text>
        </TouchableOpacity>
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
  coinsLabel: {
    fontSize: 18,
    marginRight: 5,
  },
  coinsValue: {
    color: COLORS.GOLD,
    fontSize: 20,
    fontWeight: '700',
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
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '900',
  },
});

export default GameUI;