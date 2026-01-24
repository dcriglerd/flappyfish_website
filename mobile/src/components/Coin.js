import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/config';

const Coin = ({ position, isMagnetized = false }) => {
  const scaleX = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  // Spinning animation
  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(scaleX, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleX, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [scaleX]);

  // Magnet glow effect
  useEffect(() => {
    if (isMagnetized) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.3,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowOpacity.setValue(0);
    }
  }, [isMagnetized, glowOpacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.x - 15,
          top: position.y - 15,
          transform: [{ scaleX }],
        },
      ]}
    >
      {/* Magnet glow */}
      {isMagnetized && (
        <Animated.View 
          style={[
            styles.magnetGlow,
            { opacity: glowOpacity }
          ]} 
        />
      )}
      <View style={[styles.coin, isMagnetized && styles.coinMagnetized]}>
        <View style={styles.coinInner} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  magnetGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#a855f7',
    top: -7,
    left: -7,
  },
  coin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.GOLD,
    borderWidth: 3,
    borderColor: '#DAA520',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinMagnetized: {
    borderColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  coinInner: {
    width: 10,
    height: 16,
    backgroundColor: '#DAA520',
    borderRadius: 2,
  },
});

export default Coin;
