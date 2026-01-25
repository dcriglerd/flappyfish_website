import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Ellipse, Polygon, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/config';

const Fish = ({ position, rotation = 0, skinColor = COLORS.GOLD, hasShield = false }) => {
  const isRainbow = skinColor === 'rainbow';
  
  // Darken color for outlines
  const getDarkerColor = (color) => {
    if (color === 'rainbow') return '#996600';
    return color;
  };

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
      {/* Shield bubble */}
      {hasShield && (
        <View style={styles.shieldBubble}>
          <Svg width={80} height={70} viewBox="0 0 80 70">
            <Ellipse
              cx="40"
              cy="35"
              rx="38"
              ry="33"
              fill="rgba(100,200,255,0.2)"
              stroke="rgba(100,200,255,0.6)"
              strokeWidth="3"
            />
            {/* Shine effect */}
            <Ellipse
              cx="25"
              cy="20"
              rx="8"
              ry="5"
              fill="rgba(255,255,255,0.4)"
            />
          </Svg>
        </View>
      )}
      
      <Svg width={60} height={50} viewBox="0 0 80 60">
        {isRainbow && (
          <Defs>
            <LinearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#ff0000" />
              <Stop offset="20%" stopColor="#ffff00" />
              <Stop offset="40%" stopColor="#00ff00" />
              <Stop offset="60%" stopColor="#00ffff" />
              <Stop offset="80%" stopColor="#0000ff" />
              <Stop offset="100%" stopColor="#ff00ff" />
            </LinearGradient>
          </Defs>
        )}
        
        {/* Fish body */}
        <Ellipse 
          cx="40" 
          cy="30" 
          rx="28" 
          ry="20" 
          fill={isRainbow ? 'url(#rainbowGradient)' : skinColor} 
          stroke={getDarkerColor(skinColor)} 
          strokeWidth="3" 
        />
        {/* Tail fin */}
        <Polygon 
          points="12,30 -8,12 -8,48" 
          fill={isRainbow ? 'url(#rainbowGradient)' : skinColor} 
          stroke={getDarkerColor(skinColor)} 
          strokeWidth="2" 
        />
        {/* Top fin */}
        <Polygon 
          points="35,10 45,-5 55,10" 
          fill={isRainbow ? 'url(#rainbowGradient)' : skinColor} 
          stroke={getDarkerColor(skinColor)} 
          strokeWidth="2" 
        />
        {/* Bottom fin */}
        <Polygon 
          points="40,48 50,60 58,48" 
          fill={isRainbow ? 'url(#rainbowGradient)' : skinColor} 
          stroke={getDarkerColor(skinColor)} 
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
  shieldBubble: {
    position: 'absolute',
    left: -10,
    top: -10,
    width: 80,
    height: 70,
  },
});

export default Fish;
