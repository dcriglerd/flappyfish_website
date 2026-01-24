import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GAME_CONFIG, COLORS } from '../constants/config';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Obstacle = ({ position }) => {
  const pipeWidth = 70;
  const capHeight = 20;
  const gapTop = position.gapY - GAME_CONFIG.GAP_HEIGHT / 2;
  const gapBottom = position.gapY + GAME_CONFIG.GAP_HEIGHT / 2;
  const topPipeHeight = gapTop - capHeight;
  const bottomPipeStart = gapBottom;

  return (
    <View style={[styles.container, { left: position.x }]}> 
      {/* Top Pipe */}
      <View style={[styles.pipe, { top: 0, height: topPipeHeight, width: pipeWidth }]}>
        <View style={styles.pipeInner} />
      </View>
      <View style={[styles.pipeCap, { top: topPipeHeight, width: pipeWidth + 10 }]} />

      {/* Bottom Pipe */}
      <View style={[styles.pipeCap, { top: bottomPipeStart, width: pipeWidth + 10 }]} />
      <View style={[styles.pipe, { top: bottomPipeStart + capHeight, height: SCREEN_HEIGHT - bottomPipeStart - capHeight, width: pipeWidth }]}>
        <View style={styles.pipeInner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 80,
    height: '100%',
  },
  pipe: {
    position: 'absolute',
    left: 5,
    backgroundColor: '#2d8a6e',
    borderWidth: 2,
    borderColor: '#1a5a4a',
  },
  pipeInner: {
    position: 'absolute',
    left: 5,
    top: 0,
    bottom: 0,
    width: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  pipeCap: {
    position: 'absolute',
    left: 0,
    height: 20,
    backgroundColor: '#3cb371',
    borderWidth: 2,
    borderColor: '#1a5a4a',
    borderRadius: 4,
  },
});

export default Obstacle;