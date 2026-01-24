import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../constants/config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Bubble = ({ delay, index }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT + 50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const size = useMemo(() => 8 + Math.random() * 15, []);
  const left = useMemo(() => Math.random() * SCREEN_WIDTH, []);

  useEffect(() => {
    let mounted = true;
    
    const animate = () => {
      if (!mounted) return;
      
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
      ]).start(() => {
        if (mounted) animate();
      });
    };

    animate();
    
    return () => {
      mounted = false;
    };
  }, [delay, translateY, opacity]);

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

const Seaweed = ({ index }) => {
  const swayAnim = useRef(new Animated.Value(0)).current;
  const height = useMemo(() => 50 + Math.random() * 40, []);
  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 1500 + index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: 0,
          duration: 1500 + index * 100,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [swayAnim, index]);

  const rotation = swayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-8deg', '8deg'],
  });

  return (
    <Animated.View
      style={[
        styles.seaweed,
        {
          left: index * (SCREEN_WIDTH / 10) + 10,
          height,
          transform: [{ rotate: rotation }],
        },
      ]}
    />
  );
};

const Background = () => {
  const bubbles = useMemo(() => 
    Array.from({ length: 15 }).map((_, i) => (
      <Bubble key={i} delay={Math.random() * 5} index={i} />
    )), 
  []);

  const seaweeds = useMemo(() =>
    Array.from({ length: 10 }).map((_, i) => (
      <Seaweed key={`seaweed_${i}`} index={i} />
    )),
  []);

  return (
    <View style={styles.container}>
      {/* Ocean gradient background */}
      <View style={styles.gradient}>
        <View style={[styles.gradientLayer, styles.gradientTop]} />
        <View style={[styles.gradientLayer, styles.gradientMid1]} />
        <View style={[styles.gradientLayer, styles.gradientMid2]} />
        <View style={[styles.gradientLayer, styles.gradientBottom]} />
      </View>

      {/* Light rays from surface */}
      <View style={styles.lightRays}>
        {[0, 1, 2, 3, 4].map(i => (
          <View 
            key={`ray_${i}`} 
            style={[
              styles.lightRay,
              { left: `${10 + i * 18}%`, transform: [{ rotate: `${-5 + i * 2}deg` }] }
            ]} 
          />
        ))}
      </View>

      {/* Bubbles */}
      {bubbles}

      {/* Seaweed */}
      {seaweeds}

      {/* Sandy floor */}
      <View style={styles.floor}>
        <View style={styles.floorWave} />
      </View>
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
    ...StyleSheet.absoluteFillObject,
  },
  gradientLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '28%',
  },
  gradientTop: {
    top: 0,
    backgroundColor: '#00d4ff',
  },
  gradientMid1: {
    top: '25%',
    backgroundColor: '#00b4d8',
  },
  gradientMid2: {
    top: '50%',
    backgroundColor: '#0096c7',
  },
  gradientBottom: {
    top: '75%',
    height: '30%',
    backgroundColor: '#0077b6',
  },
  lightRays: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  lightRay: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: '70%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    transformOrigin: 'top center',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  seaweed: {
    position: 'absolute',
    bottom: 45,
    width: 10,
    backgroundColor: COLORS.GREEN,
    borderRadius: 5,
    transformOrigin: 'bottom center',
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: '#f4d03f',
    borderTopWidth: 3,
    borderTopColor: '#daa520',
  },
  floorWave: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(218,165,32,0.3)',
  },
});

export default Background;
