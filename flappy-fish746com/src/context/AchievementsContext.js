import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACHIEVEMENTS } from '../data/achievements';

const AchievementsContext = createContext();

const STORAGE_KEYS = {
  UNLOCKED: 'flappyfish_achievements_unlocked',
  STATS: 'flappyfish_achievement_stats',
};

export const AchievementsProvider = ({ children }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalCoinsEarned: 0,
    gamesPlayed: 0,
    highScore: 0,
    skinsUnlocked: 1,
    powerupsUsed: 0,
    shieldsUsed: 0,
  });
  const [newlyUnlocked, setNewlyUnlocked] = useState(null); // For showing unlock notification
  const [isLoaded, setIsLoaded] = useState(false);
  const [canShowNotifications, setCanShowNotifications] = useState(true); // Control when notifications show
  const pendingRewardsRef = useRef([]);
  const queuedNotificationsRef = useRef([]); // Queue notifications during gameplay

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [savedUnlocked, savedStats] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED),
          AsyncStorage.getItem(STORAGE_KEYS.STATS),
        ]);

        if (savedUnlocked) {
          setUnlockedAchievements(JSON.parse(savedUnlocked));
        }

        if (savedStats) {
          setStats(prev => ({ ...prev, ...JSON.parse(savedStats) }));
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('[Achievements] Load error:', error);
        setIsLoaded(true);
      }
    };
    
    loadSavedData();
  }, []);

  // Load from cloud data (called when cloud sync fetches data)
  const loadFromCloud = useCallback(async (cloudData) => {
    try {
      if (!cloudData) return;
      
      const cloudUnlocked = cloudData.unlocked_achievements || [];
      const cloudStats = cloudData.achievement_stats || {};
      
      // Merge with local data (keep more achievements)
      const mergedUnlocked = [...new Set([...unlockedAchievements, ...cloudUnlocked])];
      
      // Merge stats (keep higher values)
      const mergedStats = {
        totalCoinsEarned: Math.max(stats.totalCoinsEarned, cloudStats.totalCoinsEarned || 0),
        gamesPlayed: Math.max(stats.gamesPlayed, cloudStats.gamesPlayed || 0),
        highScore: Math.max(stats.highScore, cloudStats.highScore || 0),
        skinsUnlocked: Math.max(stats.skinsUnlocked, cloudStats.skinsUnlocked || 1),
        powerupsUsed: Math.max(stats.powerupsUsed, cloudStats.powerupsUsed || 0),
        shieldsUsed: Math.max(stats.shieldsUsed, cloudStats.shieldsUsed || 0),
      };
      
      setUnlockedAchievements(mergedUnlocked);
      setStats(mergedStats);
      
      // Save merged data locally
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED, JSON.stringify(mergedUnlocked));
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(mergedStats));
      
      console.log('[Achievements] Merged with cloud data:', { mergedUnlocked, mergedStats });
    } catch (error) {
      console.error('[Achievements] Load from cloud error:', error);
    }
  }, [unlockedAchievements, stats]);

  // Save achievements
  const saveAchievements = useCallback(async (unlocked) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED, JSON.stringify(unlocked));
    } catch (error) {
      console.error('[Achievements] Save error:', error);
    }
  }, []);

  // Save stats
  const saveStats = useCallback(async (newStats) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
    } catch (error) {
      console.error('[Achievements] Save stats error:', error);
    }
  }, []);

  // Check and unlock achievements based on current stats
  const checkAchievements = useCallback((currentStats, gameScore = 0, coinsInGame = 0) => {
    const newUnlocks = [];

    ACHIEVEMENTS.forEach(achievement => {
      // Skip if already unlocked
      if (unlockedAchievements.includes(achievement.id)) return;

      let isUnlocked = false;
      const req = achievement.requirement;

      switch (req.type) {
        case 'score':
          isUnlocked = gameScore >= req.value;
          break;
        case 'total_coins':
          isUnlocked = currentStats.totalCoinsEarned >= req.value;
          break;
        case 'games_played':
          isUnlocked = currentStats.gamesPlayed >= req.value;
          break;
        case 'skins_unlocked':
          isUnlocked = currentStats.skinsUnlocked >= req.value;
          break;
        case 'powerups_used':
          isUnlocked = currentStats.powerupsUsed >= req.value;
          break;
        case 'shields_used':
          isUnlocked = currentStats.shieldsUsed >= req.value;
          break;
        case 'score_no_coins':
          isUnlocked = gameScore >= req.value && coinsInGame === 0;
          break;
        default:
          break;
      }

      if (isUnlocked) {
        newUnlocks.push(achievement);
      }
    });

    if (newUnlocks.length > 0) {
      const newUnlockedIds = [...unlockedAchievements, ...newUnlocks.map(a => a.id)];
      setUnlockedAchievements(newUnlockedIds);
      saveAchievements(newUnlockedIds);

      // Queue rewards
      pendingRewardsRef.current = [...pendingRewardsRef.current, ...newUnlocks];

      // Queue notifications - only show when allowed (game over screen)
      queuedNotificationsRef.current = [...queuedNotificationsRef.current, ...newUnlocks];
      
      // Only show notification immediately if allowed (not during gameplay)
      if (canShowNotifications && queuedNotificationsRef.current.length > 0) {
        setNewlyUnlocked(queuedNotificationsRef.current[0]);
      }

      console.log('[Achievements] Unlocked:', newUnlocks.map(a => a.name));
    }

    return newUnlocks;
  }, [unlockedAchievements, saveAchievements, canShowNotifications]);

  // Update stats after game
  const updateStats = useCallback(async (updates) => {
    const newStats = { ...stats };

    if (updates.coinsEarned) {
      newStats.totalCoinsEarned += updates.coinsEarned;
    }
    if (updates.gameCompleted) {
      newStats.gamesPlayed += 1;
    }
    if (updates.score && updates.score > newStats.highScore) {
      newStats.highScore = updates.score;
    }
    if (updates.skinsUnlocked) {
      newStats.skinsUnlocked = updates.skinsUnlocked;
    }
    if (updates.powerupUsed) {
      newStats.powerupsUsed += 1;
    }
    if (updates.shieldUsed) {
      newStats.shieldsUsed += 1;
    }

    setStats(newStats);
    await saveStats(newStats);

    // Check for new achievements
    return checkAchievements(newStats, updates.score || 0, updates.coinsInGame || 0);
  }, [stats, saveStats, checkAchievements]);

  // Get pending rewards and clear them
  const claimPendingRewards = useCallback(() => {
    const rewards = pendingRewardsRef.current;
    const totalCoins = rewards.reduce((sum, a) => sum + a.reward, 0);
    pendingRewardsRef.current = [];
    return { rewards, totalCoins };
  }, []);

  // Dismiss the unlock notification
  const dismissNotification = useCallback(() => {
    setNewlyUnlocked(null);
    // Show next one if there are more
    if (pendingRewardsRef.current.length > 1) {
      setTimeout(() => {
        setNewlyUnlocked(pendingRewardsRef.current[1]);
      }, 300);
    }
  }, []);

  // Get progress for an achievement
  const getProgress = useCallback((achievementId) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return { current: 0, target: 0, percentage: 0 };

    const req = achievement.requirement;
    let current = 0;

    switch (req.type) {
      case 'score':
        current = stats.highScore;
        break;
      case 'total_coins':
        current = stats.totalCoinsEarned;
        break;
      case 'games_played':
        current = stats.gamesPlayed;
        break;
      case 'skins_unlocked':
        current = stats.skinsUnlocked;
        break;
      case 'powerups_used':
        current = stats.powerupsUsed;
        break;
      case 'shields_used':
        current = stats.shieldsUsed;
        break;
      default:
        break;
    }

    return {
      current,
      target: req.value,
      percentage: Math.min(100, Math.round((current / req.value) * 100)),
    };
  }, [stats]);

  const value = {
    unlockedAchievements,
    stats,
    newlyUnlocked,
    isLoaded,
    
    // Actions
    updateStats,
    checkAchievements,
    claimPendingRewards,
    dismissNotification,
    getProgress,
    loadFromCloud,
    
    // Helpers
    isUnlocked: (id) => unlockedAchievements.includes(id),
    getUnlockedCount: () => unlockedAchievements.length,
    getTotalCount: () => ACHIEVEMENTS.length,
  };

  return (
    <AchievementsContext.Provider value={value}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementsProvider');
  }
  return context;
};
