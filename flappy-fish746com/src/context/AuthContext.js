import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

const AuthContext = createContext();

const STORAGE_KEYS = {
  USER_ID: 'flappyfish_user_id',
  USERNAME: 'flappyfish_username',
  DEVICE_ID: 'flappyfish_device_id',
  AUTH_DATA: 'flappyfish_auth_data',
};

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Generate a unique device identifier
  const generateDeviceId = async () => {
    try {
      let deviceIdentifier = null;

      // Try to get platform-specific identifiers
      if (Platform.OS === 'ios') {
        // iOS: Use identifierForVendor (persists until app reinstall)
        deviceIdentifier = await Application.getIosIdForVendorAsync();
      } else if (Platform.OS === 'android') {
        // Android: Use androidId (persists across reinstalls)
        deviceIdentifier = Application.getAndroidId();
      }

      // Fallback: Generate a UUID-like identifier
      if (!deviceIdentifier) {
        // Check if we have a stored device ID
        const storedDeviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
        if (storedDeviceId) {
          deviceIdentifier = storedDeviceId;
        } else {
          // Generate new ID with device info for uniqueness
          const deviceInfo = [
            Device.brand || 'unknown',
            Device.modelName || 'unknown',
            Date.now().toString(36),
            Math.random().toString(36).substring(2, 10),
          ].join('_');
          deviceIdentifier = `device_${deviceInfo}`;
        }
      }

      // Store the device ID
      await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceIdentifier);
      return deviceIdentifier;
    } catch (error) {
      console.error('[Auth] Error generating device ID:', error);
      // Ultimate fallback
      const fallbackId = `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, fallbackId);
      return fallbackId;
    }
  };

  // Initialize authentication
  const initializeAuth = async () => {
    try {
      // Get or generate device ID
      const deviceIdentifier = await generateDeviceId();
      setDeviceId(deviceIdentifier);

      // Load stored auth data
      const storedAuthData = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_DATA);
      
      if (storedAuthData) {
        const authData = JSON.parse(storedAuthData);
        setUserId(authData.userId);
        setUsername(authData.username || null);
        setIsGuest(authData.isGuest !== false);
      } else {
        // First time user - create guest account
        const guestUserId = `guest_${deviceIdentifier.substring(0, 20)}`;
        setUserId(guestUserId);
        setIsGuest(true);
        
        // Store initial auth data
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_DATA, JSON.stringify({
          userId: guestUserId,
          deviceId: deviceIdentifier,
          isGuest: true,
          createdAt: new Date().toISOString(),
        }));
      }

      setIsInitialized(true);
      console.log('[Auth] Initialized:', { deviceId: deviceIdentifier, isGuest: true });
    } catch (error) {
      console.error('[Auth] Initialization error:', error);
      // Fallback: Create temporary session
      const tempUserId = `temp_${Date.now()}`;
      setUserId(tempUserId);
      setIsGuest(true);
      setIsInitialized(true);
    }
  };

  // Set a custom username (for leaderboard)
  const setUserDisplayName = useCallback(async (newUsername) => {
    try {
      const cleanUsername = newUsername.trim().substring(0, 20); // Limit to 20 chars
      
      if (cleanUsername.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters' };
      }

      setUsername(cleanUsername);
      
      // Update stored auth data
      const storedAuthData = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_DATA);
      const authData = storedAuthData ? JSON.parse(storedAuthData) : {};
      
      authData.username = cleanUsername;
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_DATA, JSON.stringify(authData));
      
      console.log('[Auth] Username set:', cleanUsername);
      return { success: true };
    } catch (error) {
      console.error('[Auth] Set username error:', error);
      return { success: false, error: 'Failed to save username' };
    }
  }, []);

  // Get display name (username or guest ID)
  const getDisplayName = useCallback(() => {
    if (username) return username;
    if (userId) {
      // Format guest ID nicely
      if (userId.startsWith('guest_')) {
        return `Player${userId.substring(6, 12).toUpperCase()}`;
      }
      return userId.substring(0, 12);
    }
    return 'Player';
  }, [username, userId]);

  // Link device to an account (for future social login)
  const linkAccount = useCallback(async (accountType, accountData) => {
    try {
      const storedAuthData = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_DATA);
      const authData = storedAuthData ? JSON.parse(storedAuthData) : {};
      
      // Update auth data with linked account
      authData.linkedAccount = {
        type: accountType,
        ...accountData,
        linkedAt: new Date().toISOString(),
      };
      authData.isGuest = false;
      
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_DATA, JSON.stringify(authData));
      setIsGuest(false);
      
      console.log('[Auth] Account linked:', accountType);
      return { success: true };
    } catch (error) {
      console.error('[Auth] Link account error:', error);
      return { success: false, error: 'Failed to link account' };
    }
  }, []);

  // Clear auth data (for testing/logout)
  const clearAuth = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.USERNAME,
        STORAGE_KEYS.AUTH_DATA,
      ]);
      
      // Reinitialize
      await initializeAuth();
      
      console.log('[Auth] Auth data cleared');
      return { success: true };
    } catch (error) {
      console.error('[Auth] Clear auth error:', error);
      return { success: false };
    }
  }, []);

  // Get device info for debugging
  const getDeviceInfo = useCallback(() => {
    return {
      brand: Device.brand,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      deviceId: deviceId,
    };
  }, [deviceId]);

  const value = {
    // State
    userId,
    username,
    deviceId,
    isInitialized,
    isGuest,
    
    // Getters
    getDisplayName,
    getDeviceInfo,
    
    // Actions
    setUserDisplayName,
    linkAccount,
    clearAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
