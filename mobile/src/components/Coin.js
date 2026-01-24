import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/config';

const Coin = ({ position }) => {
  const scaleX = useRef(new Animated.Value(1)).current;

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
  }, []);

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
      <View style={styles.coin}>
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
  coinInner: {
    width: 10,
    height: 16,
    backgroundColor: '#DAA520',
    borderRadius: 2,
  },
});

export default Coin;