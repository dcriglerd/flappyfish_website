import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS } from '../constants/config';
import { POWER_UPS } from '../data/gameData';

const PowerUpBar = ({ 
  ownedPowerUps, 
  activePowerUps, 
  onActivatePowerUp,
}) => {
  // Filter to only show power-ups the user owns
  const availablePowerUps = POWER_UPS.filter(
    (p) => (ownedPowerUps[p.id] || 0) > 0
  );

  if (availablePowerUps.length === 0) return null;

  return (
    <View style={styles.container}>
      {availablePowerUps.map((powerUp) => {
        const count = ownedPowerUps[powerUp.id] || 0;
        const isActive = activePowerUps[powerUp.id]?.active;

        return (
          <TouchableOpacity
            key={powerUp.id}
            style={[
              styles.powerUpButton,
              isActive && styles.powerUpButtonActive,
            ]}
            onPress={() => !isActive && onActivatePowerUp(powerUp.id)}
            disabled={isActive}
            activeOpacity={0.7}
          >
            <Text style={styles.powerUpIcon}>{powerUp.icon}</Text>
            {!isActive && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{count}</Text>
              </View>
            )}
            {isActive && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeText}>ON</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  powerUpButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  powerUpButtonActive: {
    backgroundColor: 'rgba(168,85,247,0.7)',
    borderColor: '#a855f7',
  },
  powerUpIcon: {
    fontSize: 24,
  },
  countBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.GOLD,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    color: '#78350f',
    fontSize: 11,
    fontWeight: '800',
  },
  activeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#22c55e',
    borderRadius: 10,
    minWidth: 24,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  activeText: {
    color: COLORS.WHITE,
    fontSize: 9,
    fontWeight: '800',
  },
});

export default PowerUpBar;
