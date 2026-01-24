import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../constants/config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Bubble = ({ delay }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT + 50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const size = 8 + Math.random() * 15;
  const left = Math.random() * SCREEN_WIDTH;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(SCREEN_HEIGHT + 50);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay * 1000),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -50,
            duration: 5000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.6,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.6,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => animate());
    };

    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          left,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

const Background = () => {
  return (
    <View style={styles.container}>
      {/* Ocean gradient background */}
      <View style={styles.gradient}>
        <View style={[styles.gradientLayer, { backgroundColor: '#00d4ff', top: 0 }]} />
        <View style={[styles.gradientLayer, { backgroundColor: '#00b4d8', top: '25%' }]} />
        <View style={[styles.gradientLayer, { backgroundColor: '#0096c7', top: '50%' }]} />
        <View style={[styles.gradientLayer, { backgroundColor: '#0077b6', top: '75%' }]} />
      </View>

      {/* Bubbles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Bubble key={i} delay={Math.random() * 5} />
      ))}

      {/* Sandy floor */}
      <View style={styles.floor} />

      {/* Seaweed */}
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`seaweed_${i}`}
          style={[
            styles.seaweed,
            { left: i * (SCREEN_WIDTH / 8), height: 50 + Math.random() * 30 },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '30%',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: COLORS.SAND,
  },
  seaweed: {
    position: 'absolute',
    bottom: 40,
    width: 8,
    backgroundColor: COLORS.GREEN,
    borderRadius: 4,
  },
});

export default Background;