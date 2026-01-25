import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AchievementUnlockNotification = ({ achievement, onDismiss, onClaim }) => {
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (achievement) {
      // Slide in and scale up
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss && onDismiss();
    });
  };

  const handleClaim = () => {
    onClaim && onClaim(achievement);
    handleDismiss();
  };

  if (!achievement) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{achievement.icon}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.unlockText}>🎉 Achievement Unlocked!</Text>
          <Text style={styles.achievementName}>{achievement.name}</Text>
          <Text style={styles.achievementDesc}>{achievement.description}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
        <Text style={styles.claimText}>🪙 +{achievement.reward}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f1c40f',
    shadowColor: '#f1c40f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(241,196,15,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  unlockText: {
    color: '#f1c40f',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementName: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '800',
  },
  achievementDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  claimButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  claimText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default AchievementUnlockNotification;
