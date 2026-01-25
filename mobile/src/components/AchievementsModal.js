import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/config';
import { ACHIEVEMENTS } from '../data/achievements';
import { useAchievements } from '../context/AchievementsContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AchievementItem = ({ achievement, isUnlocked, progress }) => {
  return (
    <View style={[styles.achievementItem, isUnlocked && styles.achievementUnlocked]}>
      <View style={[styles.iconContainer, isUnlocked && styles.iconContainerUnlocked]}>
        <Text style={styles.icon}>{isUnlocked ? achievement.icon : '🔒'}</Text>
      </View>
      
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementName, isUnlocked && styles.textUnlocked]}>
          {achievement.name}
        </Text>
        <Text style={styles.achievementDesc}>{achievement.description}</Text>
        
        {/* Progress bar for locked achievements */}
        {!isUnlocked && progress.target > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {progress.current}/{progress.target}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.rewardContainer}>
        <Text style={styles.rewardIcon}>🪙</Text>
        <Text style={[styles.rewardText, isUnlocked && styles.rewardTextUnlocked]}>
          {isUnlocked ? '✓' : `+${achievement.reward}`}
        </Text>
      </View>
    </View>
  );
};

const AchievementsModal = ({ visible, onClose }) => {
  const { unlockedAchievements, isUnlocked, getProgress, getUnlockedCount, getTotalCount } = useAchievements();

  const renderItem = ({ item }) => {
    const unlocked = isUnlocked(item.id);
    const progress = getProgress(item.id);
    return <AchievementItem achievement={item} isUnlocked={unlocked} progress={progress} />;
  };

  // Sort: unlocked first, then by reward
  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const aUnlocked = unlockedAchievements.includes(a.id);
    const bUnlocked = unlockedAchievements.includes(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return a.reward - b.reward;
  });

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
            <View>
              <Text style={styles.headerTitle}>🏅 ACHIEVEMENTS</Text>
              <Text style={styles.headerSubtitle}>
                {getUnlockedCount()} / {getTotalCount()} Unlocked
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBar}>
              <View 
                style={[
                  styles.summaryFill, 
                  { width: `${(getUnlockedCount() / getTotalCount()) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.summaryText}>
              {Math.round((getUnlockedCount() / getTotalCount()) * 100)}% Complete
            </Text>
          </View>

          {/* Achievements List */}
          <FlatList
            data={sortedAchievements}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
    maxHeight: '85%',
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#e67e22',
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
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  summaryContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  summaryBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  summaryFill: {
    height: '100%',
    backgroundColor: '#f1c40f',
    borderRadius: 4,
  },
  summaryText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    opacity: 0.7,
  },
  achievementUnlocked: {
    backgroundColor: 'rgba(46,204,113,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46,204,113,0.3)',
    opacity: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerUnlocked: {
    backgroundColor: 'rgba(241,196,15,0.2)',
  },
  icon: {
    fontSize: 26,
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 14,
  },
  achievementName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '700',
  },
  textUnlocked: {
    color: COLORS.WHITE,
  },
  achievementDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    minWidth: 45,
    textAlign: 'right',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rewardIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  rewardText: {
    color: COLORS.GOLD,
    fontSize: 14,
    fontWeight: '700',
  },
  rewardTextUnlocked: {
    color: '#2ecc71',
  },
});

export default AchievementsModal;
