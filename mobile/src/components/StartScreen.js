import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Ellipse, Polygon, Circle } from 'react-native-svg';
import { COLORS } from '../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StartScreen = ({ 
  onStart, 
  onOpenShop, 
  onOpenSkins, 
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenDailyRewards,
  onOpenProfile,
  highScore, 
  coins, 
  isMuted, 
  onToggleMute,
  selectedSkin,
  achievementProgress,
  currentStreak,
  hasUnclaimedStreak,
  displayName,
}) => {
  const skinColor = selectedSkin?.color || COLORS.GOLD;
  const isRainbow = skinColor === 'rainbow';

  return (
    <View style={styles.container}>
      {/* Sound toggle in corner */}
      {onToggleMute && (
        <TouchableOpacity style={styles.soundButton} onPress={onToggleMute}>
          <Text style={styles.soundIcon}>{isMuted ? '🔇' : '🔊'}</Text>
        </TouchableOpacity>
      )}

      {/* Profile button in top right */}
      {onOpenProfile && (
        <TouchableOpacity style={styles.profileButton} onPress={onOpenProfile}>
          <Text style={styles.profileIcon}>👤</Text>
          <Text style={styles.profileName} numberOfLines={1}>{displayName || 'Player'}</Text>
        </TouchableOpacity>
      )}

      {/* Title with Fish */}
      <View style={styles.titleContainer}>
        {/* Fish SVG */}
        <View style={styles.fishContainer}>
          <Svg width={60} height={45} viewBox="0 0 80 60">
            <Ellipse 
              cx="40" cy="30" rx="28" ry="20" 
              fill={isRainbow ? '#FFD700' : skinColor} 
              stroke="#CC9900" strokeWidth="3" 
            />
            <Polygon points="12,30 -8,12 -8,48" fill={isRainbow ? '#FFA500' : skinColor} stroke="#CC7700" strokeWidth="2" />
            <Polygon points="35,10 45,-5 55,10" fill={isRainbow ? '#FFA500' : skinColor} stroke="#CC7700" strokeWidth="2" />
            <Ellipse cx="48" cy="38" rx="16" ry="9" fill="rgba(255,255,255,0.4)" />
            <Circle cx="55" cy="25" r="10" fill="white" stroke="#333" strokeWidth="2" />
            <Circle cx="58" cy="25" r="5" fill="black" />
            <Circle cx="56" cy="22" r="2.5" fill="white" />
          </Svg>
        </View>

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
        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>▶ START</Text>
        </TouchableOpacity>

        <View style={styles.middleButtons}>
          <TouchableOpacity style={styles.shopButton} onPress={onOpenShop} activeOpacity={0.8}>
            <Text style={styles.buttonText}>🛍 Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skinsButton} onPress={onOpenSkins} activeOpacity={0.8}>
            <Text style={styles.buttonText}>✨ Skins</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Rewards Button */}
        <TouchableOpacity 
          style={[styles.dailyRewardsButton, hasUnclaimedStreak && styles.dailyRewardsButtonGlow]} 
          onPress={onOpenDailyRewards} 
          activeOpacity={0.8}
        >
          <Text style={styles.dailyRewardsButtonText}>
            🎁 Daily Rewards {currentStreak > 0 ? `🔥${currentStreak}` : ''} {hasUnclaimedStreak ? '!' : ''}
          </Text>
        </TouchableOpacity>

        {/* Leaderboard Button */}
        <TouchableOpacity 
          style={styles.leaderboardButton} 
          onPress={onOpenLeaderboard} 
          activeOpacity={0.8}
        >
          <Text style={styles.leaderboardButtonText}>🏆 Leaderboard</Text>
        </TouchableOpacity>

        {/* Achievements Button */}
        <TouchableOpacity 
          style={styles.achievementsButton} 
          onPress={onOpenAchievements} 
          activeOpacity={0.8}
        >
          <Text style={styles.achievementsButtonText}>
            🏅 Achievements {achievementProgress ? `(${achievementProgress})` : ''}
          </Text>
        </TouchableOpacity>
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
  soundButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  soundIcon: {
    fontSize: 22,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  fishContainer: {
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
    marginBottom: 25,
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
    marginBottom: 12,
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
  middleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  dailyRewardsButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e74c3c',
    marginBottom: 10,
  },
  dailyRewardsButtonGlow: {
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  dailyRewardsButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  leaderboardButton: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.GOLD,
    marginBottom: 10,
  },
  leaderboardButtonText: {
    color: COLORS.GOLD,
    fontSize: 16,
    fontWeight: '700',
  },
  achievementsButton: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e67e22',
  },
  achievementsButtonText: {
    color: '#e67e22',
    fontSize: 16,
    fontWeight: '700',
  },
  instruction: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 25,
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: COLORS.SAND,
  },
});

export default StartScreen;
