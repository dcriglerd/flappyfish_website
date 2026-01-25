import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STREAK_REWARDS,
  getStreakReward,
  generateDailyChallenges,
  ALL_CHALLENGES_BONUS,
  getTodayDateString,
  isYesterday,
  isToday,
  getTimeUntilReset,
} from '../data/dailyRewards';

const DailyRewardsContext = createContext();

const STORAGE_KEYS = {
  STREAK_DATA: 'flappyfish_streak_data',
  DAILY_CHALLENGES: 'flappyfish_daily_challenges',
  CHALLENGE_PROGRESS: 'flappyfish_challenge_progress',
};

export const DailyRewardsProvider = ({ children }) => {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastPlayDate: null,
    streakClaimedToday: false,
  });
  
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [challengeProgress, setChallengeProgress] = useState({});
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [allChallengesBonusClaimed, setAllChallengesBonusClaimed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  
  const resetTimerRef = useRef(null);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [savedStreak, savedChallenges, savedProgress] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA),
          AsyncStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGES),
          AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_PROGRESS),
        ]);

        let streak = savedStreak ? JSON.parse(savedStreak) : {
          currentStreak: 0,
          longestStreak: 0,
          lastPlayDate: null,
          streakClaimedToday: false,
        };

        // Check and update streak based on last play date
        const today = getTodayDateString();
        
        if (streak.lastPlayDate) {
          if (isToday(streak.lastPlayDate)) {
            // Already played today - keep streak
          } else if (isYesterday(streak.lastPlayDate)) {
            // Played yesterday - streak continues but not claimed today
            streak.streakClaimedToday = false;
          } else {
            // Missed a day - reset streak
            streak.currentStreak = 0;
            streak.streakClaimedToday = false;
          }
        }
        
        setStreakData(streak);

        // Load or generate daily challenges
        let challenges = savedChallenges ? JSON.parse(savedChallenges) : null;
        let progress = savedProgress ? JSON.parse(savedProgress) : {};
        
        // Check if challenges need refresh (new day)
        if (!challenges || !challenges.date || challenges.date !== today) {
          // Generate new challenges for today
          const seed = new Date(today).getTime();
          const newChallenges = generateDailyChallenges(seed);
          challenges = { date: today, challenges: newChallenges };
          progress = { date: today, progress: {}, completed: [], bonusClaimed: false };
          
          await AsyncStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGES, JSON.stringify(challenges));
          await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_PROGRESS, JSON.stringify(progress));
        }
        
        setDailyChallenges(challenges.challenges || []);
        setChallengeProgress(progress.progress || {});
        setCompletedChallenges(progress.completed || []);
        setAllChallengesBonusClaimed(progress.bonusClaimed || false);
        
        setIsLoaded(true);
      } catch (error) {
        console.error('[DailyRewards] Load error:', error);
        setIsLoaded(true);
      }
    };
    
    loadSavedData();
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Daily reset function
  const performDailyReset = useCallback(async () => {
    const today = getTodayDateString();
    const seed = new Date(today).getTime();
    const newChallenges = generateDailyChallenges(seed);
    
    const challenges = { date: today, challenges: newChallenges };
    const progress = { date: today, progress: {}, completed: [], bonusClaimed: false };
    
    setDailyChallenges(newChallenges);
    setChallengeProgress({});
    setCompletedChallenges([]);
    setAllChallengesBonusClaimed(false);
    
    // Update streak claimed status
    setStreakData(prev => ({ ...prev, streakClaimedToday: false }));
    
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGES, JSON.stringify(challenges));
    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_PROGRESS, JSON.stringify(progress));
    
    console.log('[DailyRewards] Daily reset complete');
  }, []);

  // Set up daily reset timer
  useEffect(() => {
    if (isLoaded) {
      const scheduleReset = () => {
        const timeUntilReset = getTimeUntilReset();
        resetTimerRef.current = setTimeout(async () => {
          await performDailyReset();
          scheduleReset(); // Schedule next reset
        }, timeUntilReset);
      };
      
      scheduleReset();
      
      return () => {
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      };
    }
  }, [isLoaded, performDailyReset]);

  // Claim daily streak reward
  const claimStreakReward = useCallback(async () => {
    if (streakData.streakClaimedToday) return { success: false, alreadyClaimed: true };
    
    const today = getTodayDateString();
    const newStreak = streakData.currentStreak + 1;
    const newLongest = Math.max(newStreak, streakData.longestStreak);
    
    const newStreakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastPlayDate: today,
      streakClaimedToday: true,
    };
    
    setStreakData(newStreakData);
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(newStreakData));
    
    const reward = getStreakReward(newStreak);
    console.log('[DailyRewards] Streak claimed:', newStreak, 'days, reward:', reward.coins);
    
    return { success: true, streak: newStreak, reward };
  }, [streakData]);

  // Update challenge progress after a game
  const updateChallengeProgress = useCallback(async (gameStats) => {
    const { score, coinsCollected, usedPowerUp, gamesPlayed } = gameStats;
    const today = getTodayDateString();
    
    const newProgress = { ...challengeProgress };
    const newlyCompleted = [];
    
    dailyChallenges.forEach(challenge => {
      if (completedChallenges.includes(challenge.id)) return;
      
      let currentValue = newProgress[challenge.id] || 0;
      
      switch (challenge.type) {
        case 'score':
          // Score challenges check single game score
          if (score >= challenge.target && !completedChallenges.includes(challenge.id)) {
            newProgress[challenge.id] = challenge.target;
            newlyCompleted.push(challenge);
          } else {
            newProgress[challenge.id] = Math.max(currentValue, score);
          }
          break;
          
        case 'coins':
          // Cumulative coins today
          newProgress[challenge.id] = currentValue + coinsCollected;
          if (newProgress[challenge.id] >= challenge.target) {
            newlyCompleted.push(challenge);
          }
          break;
          
        case 'games':
          // Cumulative games today
          newProgress[challenge.id] = currentValue + 1;
          if (newProgress[challenge.id] >= challenge.target) {
            newlyCompleted.push(challenge);
          }
          break;
          
        case 'powerup':
          // Power-ups used today
          if (usedPowerUp) {
            newProgress[challenge.id] = currentValue + 1;
            if (newProgress[challenge.id] >= challenge.target) {
              newlyCompleted.push(challenge);
            }
          }
          break;
          
        case 'no_powerup':
          // Score without power-ups
          if (!usedPowerUp && score >= challenge.target) {
            newProgress[challenge.id] = challenge.target;
            newlyCompleted.push(challenge);
          } else if (!usedPowerUp) {
            newProgress[challenge.id] = Math.max(currentValue, score);
          }
          break;
          
        case 'perfect':
          // Score without collecting coins
          if (coinsCollected === 0 && score >= challenge.target) {
            newProgress[challenge.id] = challenge.target;
            newlyCompleted.push(challenge);
          } else if (coinsCollected === 0) {
            newProgress[challenge.id] = Math.max(currentValue, score);
          }
          break;
      }
    });
    
    const newCompleted = [...completedChallenges, ...newlyCompleted.map(c => c.id)];
    
    setChallengeProgress(newProgress);
    setCompletedChallenges(newCompleted);
    
    // Save progress
    const progressData = {
      date: today,
      progress: newProgress,
      completed: newCompleted,
      bonusClaimed: allChallengesBonusClaimed,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_PROGRESS, JSON.stringify(progressData));
    
    return { newlyCompleted, totalCompleted: newCompleted.length };
  }, [challengeProgress, dailyChallenges, completedChallenges, allChallengesBonusClaimed]);

  // Claim all challenges bonus
  const claimAllChallengesBonus = useCallback(async () => {
    if (allChallengesBonusClaimed) return { success: false };
    if (completedChallenges.length < dailyChallenges.length) return { success: false };
    
    setAllChallengesBonusClaimed(true);
    
    const today = getTodayDateString();
    const progressData = {
      date: today,
      progress: challengeProgress,
      completed: completedChallenges,
      bonusClaimed: true,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_PROGRESS, JSON.stringify(progressData));
    
    return { success: true, bonus: ALL_CHALLENGES_BONUS };
  }, [allChallengesBonusClaimed, completedChallenges, dailyChallenges, challengeProgress]);

  // Get data for cloud sync
  const getDataForSync = useCallback(() => {
    return {
      streak: streakData,
      challengeProgress: {
        date: getTodayDateString(),
        progress: challengeProgress,
        completed: completedChallenges,
        bonusClaimed: allChallengesBonusClaimed,
      },
    };
  }, [streakData, challengeProgress, completedChallenges, allChallengesBonusClaimed]);

  // Load from cloud data
  const loadFromCloud = useCallback(async (cloudData) => {
    if (!cloudData || !cloudData.daily_rewards) return;
    
    const { streak, challengeProgress: cloudProgress } = cloudData.daily_rewards;
    
    if (streak) {
      // Merge streak data (keep higher values)
      const mergedStreak = {
        currentStreak: Math.max(streakData.currentStreak, streak.currentStreak || 0),
        longestStreak: Math.max(streakData.longestStreak, streak.longestStreak || 0),
        lastPlayDate: streak.lastPlayDate || streakData.lastPlayDate,
        streakClaimedToday: streakData.streakClaimedToday || streak.streakClaimedToday,
      };
      setStreakData(mergedStreak);
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(mergedStreak));
    }
    
    console.log('[DailyRewards] Merged with cloud data');
  }, [streakData]);

  const value = {
    // Streak data
    streakData,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    streakClaimedToday: streakData.streakClaimedToday,
    todayStreakReward: getStreakReward(streakData.currentStreak + 1),
    
    // Challenge data
    dailyChallenges,
    challengeProgress,
    completedChallenges,
    allChallengesBonusClaimed,
    allChallengesComplete: completedChallenges.length >= dailyChallenges.length,
    
    // Status
    isLoaded,
    showStreakPopup,
    setShowStreakPopup,
    
    // Actions
    claimStreakReward,
    updateChallengeProgress,
    claimAllChallengesBonus,
    getDataForSync,
    loadFromCloud,
    
    // Helpers
    getStreakReward,
    getChallengeProgress: (id) => challengeProgress[id] || 0,
    isChallengeComplete: (id) => completedChallenges.includes(id),
  };

  return (
    <DailyRewardsContext.Provider value={value}>
      {children}
    </DailyRewardsContext.Provider>
  );
};

export const useDailyRewards = () => {
  const context = useContext(DailyRewardsContext);
  if (!context) {
    throw new Error('useDailyRewards must be used within DailyRewardsProvider');
  }
  return context;
};
