import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StartScreen = ({ onStart, onOpenShop, onOpenSkins, highScore, coins }) => {
  return (
    <View style={styles.container}>
      {/* Background bubbles effect */}
      <View style={styles.bubblesContainer}>
        {Array.from({ length: 15 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              {
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 100}%`,
                width: 10 + Math.random() * 20,
                height: 10 + Math.random() * 20,
              },
            ]}
          />
        ))}
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.fishEmoji}>🐠</Text>
        <View>
          <Text style={styles.titleFlappy}>FLAPPY</Text>
          <Text style={styles.titleFish}>FISH</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>🏆 Best</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>🪙 Coins</Text>
          <Text style={[styles.statValue, { color: COLORS.GOLD }]}>{coins}</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>▶ START</Text>
        </TouchableOpacity>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.shopButton} onPress={onOpenShop}>
            <Text style={styles.buttonText}>🛍 Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skinsButton} onPress={onOpenSkins}>
            <Text style={styles.buttonText}>✨ Skins</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instruction */}
      <Text style={styles.instruction}>🫧 Tap to swim! 🫧</Text>

      {/* Floor */}
      <View style={styles.floor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bubblesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  fishEmoji: {
    fontSize: 50,
    marginRight: 10,
  },
  titleFlappy: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.WHITE,
    textShadowColor: COLORS.DARK_BLUE,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  titleFish: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.GOLD,
    textShadowColor: '#996600',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    marginTop: -10,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    color: COLORS.WHITE,
    fontSize: 28,
    fontWeight: '900',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 280,
  },
  startButton: {
    backgroundColor: COLORS.ORANGE,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#c44d1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: '900',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shopButton: {
    flex: 1,
    backgroundColor: COLORS.GREEN,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 3,
    borderColor: '#196f3d',
  },
  skinsButton: {
    flex: 1,
    backgroundColor: '#9333ea',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 3,
    borderColor: '#5b21b6',
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  instruction: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 30,
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: COLORS.SAND,
  },
});

export default StartScreen;