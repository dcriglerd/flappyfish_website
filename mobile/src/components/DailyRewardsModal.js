import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { COLORS } from '../constants/config';
import { useDailyRewards } from '../context/DailyRewardsContext';
import { useNotifications } from '../context/NotificationsContext';
import { STREAK_REWARDS, getTimeUntilReset, ALL_CHALLENGES_BONUS } from '../data/dailyRewards';
import NotificationSettings from './NotificationSettings';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilReset());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  return (
    <Text style={styles.timerText}>
      Resets in {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </Text>
  );
};

// Streak Day Component
const StreakDay = ({ day, isComplete, isCurrent, reward }) => {
  return (
    <View style={[
      styles.streakDay,
      isComplete && styles.streakDayComplete,
      isCurrent && styles.streakDayCurrent,
    ]}>
      <Text style={[styles.streakDayNumber, isComplete && styles.streakDayNumberComplete]}>
        {day}
      </Text>
      <View style={[styles.streakDayReward, isComplete && styles.streakDayRewardComplete]}>
        {isComplete ? (
          <Text style={styles.checkmark}>✓</Text>
        ) : (
          <Text style={styles.streakDayCoins}>🪙{reward}</Text>
        )}
      </View>
      {day === 7 && <Text style={styles.specialBadge}>🎁</Text>}
    </View>
  );
};

// Challenge Item Component
const ChallengeItem = ({ challenge, progress, isComplete, target }) => {
  const percentage = Math.min(100, (progress / target) * 100);
  
  return (
    <View style={[styles.challengeItem, isComplete && styles.challengeItemComplete]}>
      <View style={styles.challengeIcon}>
        <Text style={styles.challengeIconText}>{challenge.icon}</Text>
      </View>
      
      <View style={styles.challengeInfo}>
        <Text style={[styles.challengeDesc, isComplete && styles.challengeDescComplete]}>
          {challenge.description}
        </Text>
        
        {!isComplete ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${percentage}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}/{target}</Text>
          </View>
        ) : (
          <Text style={styles.completedText}>✓ Completed!</Text>
        )}
      </View>
      
      <View style={styles.challengeReward}>
        <Text style={styles.rewardIcon}>🪙</Text>
        <Text style={[styles.rewardAmount, isComplete && styles.rewardAmountComplete]}>
          +{challenge.reward}
        </Text>
      </View>
    </View>
  );
};

const DailyRewardsModal = ({ visible, onClose, onClaimCoins }) => {
  const [activeTab, setActiveTab] = useState('streak');
  const {
    currentStreak,
    longestStreak,
    streakClaimedToday,
    todayStreakReward,
    claimStreakReward,
    dailyChallenges,
    challengeProgress,
    completedChallenges,
    allChallengesComplete,
    allChallengesBonusClaimed,
    claimAllChallengesBonus,
    getChallengeProgress,
    isChallengeComplete,
  } = useDailyRewards();

  const handleClaimStreak = async () => {
    const result = await claimStreakReward();
    if (result.success && onClaimCoins) {
      onClaimCoins(result.reward.coins, `Day ${result.streak} Streak Bonus!`);
    }
  };

  const handleClaimAllBonus = async () => {
    const result = await claimAllChallengesBonus();
    if (result.success && onClaimCoins) {
      onClaimCoins(result.bonus, 'All Challenges Bonus!');
    }
  };

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
            <Text style={styles.headerTitle}>🎁 DAILY REWARDS</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <CountdownTimer />
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'streak' && styles.tabActive]}
              onPress={() => setActiveTab('streak')}
            >
              <Text style={[styles.tabText, activeTab === 'streak' && styles.tabTextActive]}>
                🔥 Streak
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'challenges' && styles.tabActive]}
              onPress={() => setActiveTab('challenges')}
            >
              <Text style={[styles.tabText, activeTab === 'challenges' && styles.tabTextActive]}>
                🎯 Challenges ({completedChallenges.length}/{dailyChallenges.length})
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'streak' ? (
              <View style={styles.streakContent}>
                {/* Current Streak Display */}
                <View style={styles.streakHeader}>
                  <Text style={styles.streakNumber}>{currentStreak}</Text>
                  <Text style={styles.streakLabel}>Day Streak 🔥</Text>
                  <Text style={styles.longestStreak}>Best: {longestStreak} days</Text>
                </View>

                {/* Streak Progress */}
                <View style={styles.streakProgress}>
                  {STREAK_REWARDS.map((reward) => (
                    <StreakDay
                      key={reward.day}
                      day={reward.day}
                      reward={reward.coins}
                      isComplete={currentStreak >= reward.day}
                      isCurrent={currentStreak + 1 === reward.day && !streakClaimedToday}
                    />
                  ))}
                </View>

                {/* Claim Button */}
                <TouchableOpacity
                  style={[
                    styles.claimButton,
                    streakClaimedToday && styles.claimButtonDisabled,
                  ]}
                  onPress={handleClaimStreak}
                  disabled={streakClaimedToday}
                >
                  <Text style={styles.claimButtonText}>
                    {streakClaimedToday
                      ? '✓ Claimed Today!'
                      : `Claim Day ${currentStreak + 1} - 🪙 +${todayStreakReward.coins}`}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.streakTip}>
                  💡 Play every day to build your streak and earn bigger rewards!
                </Text>
              </View>
            ) : (
              <View style={styles.challengesContent}>
                {/* Challenges List */}
                {dailyChallenges.map((challenge) => (
                  <ChallengeItem
                    key={challenge.id}
                    challenge={challenge}
                    progress={getChallengeProgress(challenge.id)}
                    target={challenge.target}
                    isComplete={isChallengeComplete(challenge.id)}
                  />
                ))}

                {/* All Challenges Bonus */}
                <View style={[
                  styles.allChallengesBonus,
                  allChallengesComplete && styles.allChallengesBonusComplete,
                ]}>
                  <View style={styles.bonusInfo}>
                    <Text style={styles.bonusIcon}>🏆</Text>
                    <View>
                      <Text style={styles.bonusTitle}>Complete All Challenges</Text>
                      <Text style={styles.bonusDesc}>
                        {allChallengesComplete ? 'All challenges completed!' : `${completedChallenges.length}/${dailyChallenges.length} completed`}
                      </Text>
                    </View>
                  </View>
                  
                  {allChallengesComplete && !allChallengesBonusClaimed ? (
                    <TouchableOpacity style={styles.bonusClaimButton} onPress={handleClaimAllBonus}>
                      <Text style={styles.bonusClaimText}>🪙 +{ALL_CHALLENGES_BONUS}</Text>
                    </TouchableOpacity>
                  ) : allChallengesBonusClaimed ? (
                    <View style={styles.bonusClaimed}>
                      <Text style={styles.bonusClaimedText}>✓ Claimed</Text>
                    </View>
                  ) : (
                    <View style={styles.bonusLocked}>
                      <Text style={styles.bonusLockedText}>🪙 +{ALL_CHALLENGES_BONUS}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.challengeTip}>
                  💡 Challenges reset daily at midnight UTC. Complete them all for bonus coins!
                </Text>
              </View>
            )}
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
    width: SCREEN_WIDTH * 0.92,
    maxHeight: '88%',
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#e74c3c',
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
  timerContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  timerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#f1c40f',
    backgroundColor: 'rgba(241,196,15,0.1)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#f1c40f',
  },
  content: {
    padding: 16,
  },
  // Streak styles
  streakContent: {
    alignItems: 'center',
  },
  streakHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#f1c40f',
    textShadowColor: 'rgba(241,196,15,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.WHITE,
    marginTop: -5,
  },
  longestStreak: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 4,
  },
  streakProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  streakDay: {
    alignItems: 'center',
    width: 42,
  },
  streakDayComplete: {},
  streakDayCurrent: {},
  streakDayNumber: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginBottom: 4,
  },
  streakDayNumberComplete: {
    color: '#2ecc71',
  },
  streakDayReward: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  streakDayRewardComplete: {
    backgroundColor: 'rgba(46,204,113,0.3)',
    borderColor: '#2ecc71',
  },
  streakDayCoins: {
    fontSize: 10,
    color: COLORS.WHITE,
  },
  checkmark: {
    color: '#2ecc71',
    fontSize: 18,
    fontWeight: '900',
  },
  specialBadge: {
    position: 'absolute',
    top: -8,
    right: -4,
    fontSize: 16,
  },
  claimButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  claimButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  claimButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
  streakTip: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  // Challenges styles
  challengesContent: {},
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  challengeItemComplete: {
    backgroundColor: 'rgba(46,204,113,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46,204,113,0.3)',
  },
  challengeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeIconText: {
    fontSize: 22,
  },
  challengeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  challengeDesc: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  challengeDescComplete: {
    color: 'rgba(255,255,255,0.7)',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
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
    minWidth: 40,
    textAlign: 'right',
  },
  completedText: {
    color: '#2ecc71',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  challengeReward: {
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
  rewardAmount: {
    color: COLORS.GOLD,
    fontSize: 14,
    fontWeight: '700',
  },
  rewardAmountComplete: {
    color: '#2ecc71',
  },
  allChallengesBonus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(241,196,15,0.1)',
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(241,196,15,0.3)',
  },
  allChallengesBonusComplete: {
    backgroundColor: 'rgba(46,204,113,0.15)',
    borderColor: 'rgba(46,204,113,0.5)',
  },
  bonusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bonusIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  bonusTitle: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '700',
  },
  bonusDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  bonusClaimButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bonusClaimText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '800',
  },
  bonusClaimed: {
    backgroundColor: 'rgba(46,204,113,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bonusClaimedText: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: '800',
  },
  bonusLocked: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bonusLockedText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '700',
  },
  challengeTip: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DailyRewardsModal;
