import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

// Note: react-native-google-play-game-services requires native configuration
// This context provides a wrapper for Play Games Services functionality

const PlayGamesContext = createContext();

export const PlayGamesProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Play Games Services
  const initialize = useCallback(async () => {
    if (Platform.OS !== 'android') {
      console.log('[PlayGames] Not on Android, skipping initialization');
      return;
    }

    try {
      // Import dynamically to avoid issues on non-Android platforms
      const PlayGames = require('react-native-google-play-game-services').default;
      
      await PlayGames.signIn();
      setIsSignedIn(true);
      setIsInitialized(true);
      
      // Get player info
      const player = await PlayGames.getCurrentPlayer();
      setPlayerInfo(player);
      
      console.log('[PlayGames] Signed in:', player);
    } catch (error) {
      console.log('[PlayGames] Sign in failed:', error);
      setIsSignedIn(false);
    }
  }, []);

  // Sign in to Play Games
  const signIn = useCallback(async () => {
    if (Platform.OS !== 'android') return false;

    try {
      const PlayGames = require('react-native-google-play-game-services').default;
      await PlayGames.signIn();
      setIsSignedIn(true);
      
      const player = await PlayGames.getCurrentPlayer();
      setPlayerInfo(player);
      
      return true;
    } catch (error) {
      console.log('[PlayGames] Sign in error:', error);
      return false;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    if (Platform.OS !== 'android') return;

    try {
      const PlayGames = require('react-native-google-play-game-services').default;
      await PlayGames.signOut();
      setIsSignedIn(false);
      setPlayerInfo(null);
    } catch (error) {
      console.log('[PlayGames] Sign out error:', error);
    }
  }, []);

  // Submit score to leaderboard
  const submitScore = useCallback(async (leaderboardId, score) => {
    if (Platform.OS !== 'android' || !isSignedIn) return false;

    try {
      const PlayGames = require('react-native-google-play-game-services').default;
      await PlayGames.submitScore(leaderboardId, score);
      console.log('[PlayGames] Score submitted:', score);
      return true;
    } catch (error) {
      console.log('[PlayGames] Submit score error:', error);
      return false;
    }
  }, [isSignedIn]);

  // Show leaderboard
  const showLeaderboard = useCallback(async (leaderboardId) => {
    if (Platform.OS !== 'android') return;

    try {
      const PlayGames = require('react-native-google-play-game-services').default;
      if (leaderboardId) {
        await PlayGames.showLeaderboard(leaderboardId);
      } else {
        await PlayGames.showAllLeaderboards();
      }
    } catch (error) {
      console.log('[PlayGames] Show leaderboard error:', error);
    }
  }, []);

  // Unlock achievement
  const unlockAchievement = useCallback(async (achievementId) => {
    if (Platform.OS !== 'android' || !isSignedIn) return false;

    try {
      const PlayGames = require('react-native-google-play-game-services').default;
      await PlayGames.unlockAchievement(achievementId);
      console.log('[PlayGames] Achievement unlocked:', achievementId);
      return true;
    } catch (error) {
      console.log('[PlayGames] Unlock achievement error:', error);
      return false;
    }
  }, [isSignedIn]);

  // Show achievements
  const showAchievements = useCallback(async () => {
    if (Platform.OS !== 'android') return;

    try {
      const PlayGames = require('react-native-google-play-game-services').default;
      await PlayGames.showAchievements();
    } catch (error) {
      console.log('[PlayGames] Show achievements error:', error);
    }
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const value = {
    isSignedIn,
    isInitialized,
    playerInfo,
    signIn,
    signOut,
    submitScore,
    showLeaderboard,
    unlockAchievement,
    showAchievements,
  };

  return (
    <PlayGamesContext.Provider value={value}>
      {children}
    </PlayGamesContext.Provider>
  );
};

export const usePlayGames = () => {
  const context = useContext(PlayGamesContext);
  if (!context) {
    throw new Error('usePlayGames must be used within PlayGamesProvider');
  }
  return context;
};
