import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Ellipse, Polygon, Circle } from 'react-native-svg';
import { COLORS } from '../constants/config';

const Fish = ({ position, rotation = 0 }) => {
  return (
    <View
      style={[
        styles.container,
        {
          left: position.x - 30,
          top: position.y - 25,
          transform: [{ rotate: `${rotation}deg` }],
        },
      ]}
    >
      <Svg width={60} height={50} viewBox="0 0 80 60">
        {/* Fish body */}
        <Ellipse 
          cx="40" 
          cy="30" 
          rx="28" 
          ry="20" 
          fill={COLORS.GOLD} 
          stroke="#CC9900" 
          strokeWidth="3" 
        />
        {/* Tail fin */}
        <Polygon 
          points="12,30 -8,12 -8,48" 
          fill="#FFA500" 
          stroke="#CC7700" 
          strokeWidth="2" 
        />
        {/* Top fin */}
        <Polygon 
          points="35,10 45,-5 55,10" 
          fill="#FFA500" 
          stroke="#CC7700" 
          strokeWidth="2" 
        />
        {/* Bottom fin */}
        <Polygon 
          points="40,48 50,60 58,48" 
          fill="#FFA500" 
          stroke="#CC7700" 
          strokeWidth="2" 
        />
        {/* Belly highlight */}
        <Ellipse 
          cx="48" 
          cy="38" 
          rx="16" 
          ry="9" 
          fill="rgba(255,255,255,0.4)" 
        />
        {/* Eye white */}
        <Circle 
          cx="55" 
          cy="25" 
          r="10" 
          fill="white" 
          stroke="#333" 
          strokeWidth="2" 
        />
        {/* Pupil */}
        <Circle 
          cx="58" 
          cy="25" 
          r="5" 
          fill="black" 
        />
        {/* Eye shine */}
        <Circle 
          cx="56" 
          cy="22" 
          r="2.5" 
          fill="white" 
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 60,
    height: 50,
  },
});

export default Fish;
