import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Svg, { Ellipse, Polygon, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/config';
import { FISH_SKINS } from '../data/gameData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FishPreview = ({ skin, isUnlocked }) => {
  const opacity = isUnlocked ? 1 : 0.4;
  const isRainbow = skin.color === 'rainbow';

  return (
    <Svg width={70} height={55} viewBox="0 0 80 60">
      {isRainbow && (
        <Defs>
          <LinearGradient id={`rainbow-${skin.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ff0000" />
            <Stop offset="20%" stopColor="#ffff00" />
            <Stop offset="40%" stopColor="#00ff00" />
            <Stop offset="60%" stopColor="#00ffff" />
            <Stop offset="80%" stopColor="#0000ff" />
            <Stop offset="100%" stopColor="#ff00ff" />
          </LinearGradient>
        </Defs>
      )}
      {/* Body */}
      <Ellipse
        cx="40"
        cy="30"
        rx="28"
        ry="20"
        fill={isRainbow ? `url(#rainbow-${skin.id})` : skin.color}
        opacity={opacity}
      />
      {/* Tail */}
      <Polygon
        points="12,30 -8,12 -8,48"
        fill={isRainbow ? `url(#rainbow-${skin.id})` : skin.color}
        opacity={opacity}
      />
      {/* Top fin */}
      <Polygon
        points="35,10 45,-5 55,10"
        fill={isRainbow ? `url(#rainbow-${skin.id})` : skin.color}
        opacity={opacity * 0.8}
      />
      {/* Eye white */}
      <Circle cx="55" cy="25" r="8" fill="white" opacity={opacity} />
      {/* Pupil */}
      <Circle cx="57" cy="25" r="4" fill="black" opacity={opacity} />
      {/* Eye shine */}
      <Circle cx="55" cy="22" r="2" fill="white" opacity={opacity} />
    </Svg>
  );
};

const SkinsModal = ({
  visible,
  onClose,
  coins,
  selectedSkin,
  unlockedSkins,
  onSelectSkin,
  onUnlockSkin,
}) => {
  const [message, setMessage] = useState(null);

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleUnlock = (skin) => {
    if (coins >= skin.cost) {
      onUnlockSkin(skin);
      showMessage(`${skin.name} unlocked!`);
    } else {
      showMessage('Not enough coins!', true);
    }
  };

  const handleSelect = (skin) => {
    if (unlockedSkins.includes(skin.id)) {
      onSelectSkin(skin);
    }
  };

  const isUnlocked = (skinId) => unlockedSkins.includes(skinId);
  const isSelected = (skinId) => selectedSkin?.id === skinId;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>✨ FISH SKINS</Text>
            <View style={styles.headerRight}>
              <View style={styles.coinBadge}>
                <Text style={styles.coinIcon}>🪙</Text>
                <Text style={styles.coinText}>{coins}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Message */}
          {message && (
            <View style={[styles.message, message.isError && styles.messageError]}>
              <Text style={styles.messageText}>
                {message.isError ? '❌' : '✅'} {message.text}
              </Text>
            </View>
          )}

          {/* Skins Grid */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {FISH_SKINS.map((skin) => (
                <TouchableOpacity
                  key={skin.id}
                  style={[
                    styles.skinCard,
                    isSelected(skin.id) && styles.skinCardSelected,
                  ]}
                  onPress={() => handleSelect(skin)}
                  activeOpacity={0.8}
                >
                  {/* Fish Preview */}
                  <View style={styles.fishPreview}>
                    <FishPreview skin={skin} isUnlocked={isUnlocked(skin.id)} />
                    
                    {/* Lock icon */}
                    {!isUnlocked(skin.id) && (
                      <View style={styles.lockBadge}>
                        <Text style={styles.lockIcon}>🔒</Text>
                      </View>
                    )}
                    
                    {/* Selected check */}
                    {isSelected(skin.id) && isUnlocked(skin.id) && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedIcon}>✓</Text>
                      </View>
                    )}
                  </View>

                  {/* Skin Name */}
                  <Text style={styles.skinName}>{skin.name}</Text>

                  {/* Status / Buy Button */}
                  {isUnlocked(skin.id) ? (
                    <Text style={styles.ownedText}>
                      {isSelected(skin.id) ? '✓ Selected' : 'Owned'}
                    </Text>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.unlockButton,
                        coins < skin.cost && styles.unlockButtonDisabled,
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleUnlock(skin);
                      }}
                    >
                      <Text style={styles.unlockButtonText}>🪙 {skin.cost}</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: '80%',
    backgroundColor: '#581c87',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.WHITE,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  coinIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  coinText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.5)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  messageError: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderColor: 'rgba(239,68,68,0.5)',
  },
  messageText: {
    color: COLORS.WHITE,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skinCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  skinCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.GOLD,
  },
  fishPreview: {
    width: 80,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  lockIcon: {
    fontSize: 14,
  },
  selectedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    color: COLORS.WHITE,
    fontWeight: '900',
    fontSize: 14,
  },
  skinName: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 8,
  },
  ownedText: {
    color: '#4ade80',
    fontSize: 13,
    fontWeight: '600',
  },
  unlockButton: {
    backgroundColor: COLORS.GOLD,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  unlockButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  unlockButtonText: {
    color: '#78350f',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default SkinsModal;
