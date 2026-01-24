import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CloudSyncContext = createContext();

// API Base URL - Update this with your actual backend URL
const API_BASE_URL = 'https://your-backend-url.com/api';

// Storage keys
const STORAGE_KEYS = {
  USER_ID: 'flappyfish_cloud_user_id',
  LAST_SYNC: 'flappyfish_last_sync',
};

export const CloudSyncProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user ID on mount
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      let storedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      
      if (!storedUserId) {
        // Generate new user ID
        storedUserId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, storedUserId);
      }
      
      setUserId(storedUserId);
      
      // Load last sync time
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      if (lastSync) {
        setLastSyncTime(new Date(lastSync));
      }
      
      console.log('[CloudSync] Initialized with user ID:', storedUserId);
    } catch (err) {
      console.error('[CloudSync] Init error:', err);
    }
  };

  // Sync game data to cloud
  const syncToCloud = useCallback(async (gameData) => {
    if (!userId || isSyncing) return { success: false };
    
    try {
      setIsSyncing(true);
      setError(null);
      
      const payload = {
        user_id: userId,
        high_score: gameData.highScore || 0,
        coins: gameData.coins || 0,
        unlocked_skins: gameData.unlockedSkins || ['default'],
        selected_skin: gameData.selectedSkin?.id || 'default',
        owned_power_ups: gameData.ownedPowerUps || {},
        ads_removed: gameData.adsRemoved || false,
        total_games_played: gameData.totalGamesPlayed || 0,
        total_coins_earned: gameData.totalCoinsEarned || 0,
      };
      
      const response = await fetch(`${API_BASE_URL}/game/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      const now = new Date();
      setLastSyncTime(now);
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, now.toISOString());
      
      console.log('[CloudSync] Sync successful');
      return { success: true, data: result };
    } catch (err) {
      console.error('[CloudSync] Sync error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSyncing(false);
    }
  }, [userId, isSyncing]);

  // Fetch game data from cloud
  const fetchFromCloud = useCallback(async () => {
    if (!userId) return { success: false };
    
    try {
      setIsSyncing(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/game/${userId}`);
      
      if (response.status === 404) {
        // User not found - this is okay for new users
        return { success: true, data: null, isNewUser: true };
      }
      
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[CloudSync] Fetched from cloud:', data);
      return { success: true, data };
    } catch (err) {
      console.error('[CloudSync] Fetch error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSyncing(false);
    }
  }, [userId]);

  // Get leaderboard
  const getLeaderboard = useCallback(async (limit = 100) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Leaderboard fetch failed: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('[CloudSync] Leaderboard error:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Get user's rank
  const getUserRank = useCallback(async () => {
    if (!userId) return { success: false };
    
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/${userId}/rank`);
      
      if (response.status === 404) {
        return { success: true, data: { rank: null } };
      }
      
      if (!response.ok) {
        throw new Error(`Rank fetch failed: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('[CloudSync] Rank error:', err);
      return { success: false, error: err.message };
    }
  }, [userId]);

  // Record a purchase
  const recordPurchase = useCallback(async (purchase) => {
    if (!userId) return { success: false };
    
    try {
      const payload = {
        user_id: userId,
        product_id: purchase.productId,
        transaction_id: purchase.transactionId || `local_${Date.now()}`,
        platform: purchase.platform || 'unknown',
        amount: purchase.amount,
        currency: purchase.currency,
      };
      
      const response = await fetch(`${API_BASE_URL}/purchases/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`Purchase record failed: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('[CloudSync] Purchase record error:', err);
      return { success: false, error: err.message };
    }
  }, [userId]);

  const value = {
    userId,
    isSyncing,
    lastSyncTime,
    isOnline,
    error,
    
    // Actions
    syncToCloud,
    fetchFromCloud,
    getLeaderboard,
    getUserRank,
    recordPurchase,
  };

  return (
    <CloudSyncContext.Provider value={value}>
      {children}
    </CloudSyncContext.Provider>
  );
};

export const useCloudSync = () => {
  const context = useContext(CloudSyncContext);
  if (!context) {
    throw new Error('useCloudSync must be used within CloudSyncProvider');
  }
  return context;
};
