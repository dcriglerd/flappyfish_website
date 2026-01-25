import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { useGame } from '../context/GameContext';
import { useAds } from '../context/AdsContext';
import { useAudio } from '../context/AudioContext';
import { useCloudSync } from '../context/CloudSyncContext';
import { useAchievements } from '../context/AchievementsContext';
import { useDailyRewards } from '../context/DailyRewardsContext';
import { useNotifications } from '../context/NotificationsContext';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/config';

import StartScreen from '../components/StartScreen';
import GameOverScreen from '../components/GameOverScreen';
import GameUI from '../components/GameUI';
import BannerAdComponent from '../components/BannerAdComponent';
import Background from '../components/Background';
import GameCanvas from '../components/GameCanvas';
import SkinsModal from '../components/SkinsModal';
import PowerUpBar from '../components/PowerUpBar';
import LeaderboardModal from '../components/LeaderboardModal';
import AchievementsModal from '../components/AchievementsModal';
import AchievementUnlockNotification from '../components/AchievementUnlockNotification';
import DailyRewardsModal from '../components/DailyRewardsModal';
import UsernameModal from '../components/UsernameModal';

const FlappyFishGame = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [showSkins, setShowSkins] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [isLoadingCloudData, setIsLoadingCloudData] = useState(true);
  
  const coinsCollectedInGame = useRef(0);
  const usedPowerUpInGame = useRef(false);
  
  const {
    gameState,
    setGameState,
    score,
    highScore,
    coins,
    canRevive,
    coinMultiplier,
    startGame,
    pauseGame,
    gameOver,
    revive,
    addCoins,
    incrementScore,
    // Skins
    unlockedSkins,
    selectedSkin,
    unlockSkin,
    selectSkin,
    // Power-ups
    ownedPowerUps,
    activePowerUps,
    buyPowerUp,
    activatePowerUp,
    hasShield,
    consumeShield,
  } = useGame();

  const {
    onGameOver: onAdsGameOver,
    onGameStart: onAdsGameStart,
    showRewardedAd,
    hideBanner,
    showBannerAd,
    setGameplayActive,
  } = useAds();

  const {
    playFlapSound,
    playScoreSound,
    playCoinSound,
    playGameOverSound,
    setMuted,
  } = useAudio();

  const { syncToCloud, fetchFromCloud, userId } = useCloudSync();

  const {
    updateStats,
    newlyUnlocked,
    dismissNotification,
    getUnlockedCount,
    getTotalCount,
    unlockedAchievements,
    stats: achievementStats,
    loadFromCloud: loadAchievementsFromCloud,
    enableNotifications: enableAchievementNotifications,
    disableNotifications: disableAchievementNotifications,
  } = useAchievements();

  const {
    currentStreak,
    streakClaimedToday,
    updateChallengeProgress,
    loadFromCloud: loadDailyRewardsFromCloud,
    completedChallenges,
    dailyChallenges,
  } = useDailyRewards();

  const {
    updateStreakNotifications,
    scheduleDailyChallengeReminder,
    cancelStreakWarning,
  } = useNotifications();

  const { getDisplayName, username } = useAuth();

  // Update notifications when streak data changes
  useEffect(() => {
    updateStreakNotifications(currentStreak, streakClaimedToday, streakClaimedToday);
  }, [currentStreak, streakClaimedToday, updateStreakNotifications]);

  // Update challenge notifications
  useEffect(() => {
    if (dailyChallenges.length > 0) {
      scheduleDailyChallengeReminder(completedChallenges.length, dailyChallenges.length);
    }
  }, [completedChallenges.length, dailyChallenges.length, scheduleDailyChallengeReminder]);

  // Load cloud data on app start
  useEffect(() => {
    const loadCloudData = async () => {
      if (!userId) return;
      
      try {
        console.log('[Game] Loading cloud data...');
        const result = await fetchFromCloud();
        
        if (result.success && result.data && !result.isNewUser) {
          console.log('[Game] Cloud data loaded:', result.data);
          // Load achievements from cloud
          loadAchievementsFromCloud(result.data);
          // Load daily rewards from cloud
          loadDailyRewardsFromCloud(result.data);
        } else if (result.isNewUser) {
          console.log('[Game] New user - no cloud data');
        }
      } catch (error) {
        console.error('[Game] Failed to load cloud data:', error);
      } finally {
        setIsLoadingCloudData(false);
      }
    };
    
    loadCloudData();
  }, [userId, fetchFromCloud, loadAchievementsFromCloud, loadDailyRewardsFromCloud]);

  // Sync mute state with audio hook
  useEffect(() => {
    setMuted(isMuted);
  }, [isMuted, setMuted]);

  // Manage banner visibility and gameplay state based on game state
  useEffect(() => {
    if (gameState === 'playing') {
      hideBanner();
      setGameplayActive(true); // Tell ads system game is active
      disableAchievementNotifications(); // Don't show achievement popups during gameplay
      coinsCollectedInGame.current = 0; // Reset coins counter
      usedPowerUpInGame.current = false; // Reset power-up tracker
    } else {
      showBannerAd();
      setGameplayActive(false); // Game is not active, ads can show
      enableAchievementNotifications(); // Show any queued achievement notifications
    }
  }, [gameState, hideBanner, showBannerAd, setGameplayActive, enableAchievementNotifications, disableAchievementNotifications]);

  // Sync to cloud and check achievements on game over
  useEffect(() => {
    if (gameState === 'gameover') {
      // Update achievement stats
      updateStats({
        gameCompleted: true,
        score: score,
        coinsEarned: coinsCollectedInGame.current,
        coinsInGame: coinsCollectedInGame.current,
        skinsUnlocked: unlockedSkins.length,
      });

      // Update daily challenge progress
      updateChallengeProgress({
        score: score,
        coinsCollected: coinsCollectedInGame.current,
        usedPowerUp: usedPowerUpInGame.current,
        gamesPlayed: 1,
      });

      // Sync game data to cloud (including achievements)
      syncToCloud({
        highScore,
        coins,
        unlockedSkins,
        selectedSkin,
        ownedPowerUps,
        adsRemoved,
        totalGamesPlayed: achievementStats.gamesPlayed,
        totalCoinsEarned: achievementStats.totalCoinsEarned,
        unlockedAchievements,
        achievementStats,
      });
    }
  }, [gameState]);

  // Handle game start
  const handleStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    coinsCollectedInGame.current = 0;
    usedPowerUpInGame.current = false;
    // Cancel streak warning since player is playing
    cancelStreakWarning();
    // Track game start for interstitial ads
    onAdsGameStart();
    startGame();
  }, [startGame, cancelStreakWarning, onAdsGameStart]);

  // Handle game over
  const handleGameOver = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    playGameOverSound();
    gameOver();
    onAdsGameOver();
  }, [gameOver, onAdsGameOver, playGameOverSound]);

  // Handle retry
  const handleRetry = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    coinsCollectedInGame.current = 0;
    usedPowerUpInGame.current = false;
    // Track game start for interstitial ads
    onAdsGameStart();
    startGame();
  }, [startGame, onAdsGameStart]);

  // Handle revive with rewarded ad
  const handleRevive = useCallback(() => {
    showRewardedAd(() => {
      revive();
    });
  }, [showRewardedAd, revive]);

  // Handle return to menu
  const handleHome = useCallback(() => {
    setGameState('menu');
  }, [setGameState]);

  // Handle score with sound
  const handleScore = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playScoreSound();
    incrementScore();
  }, [incrementScore, playScoreSound]);

  // Handle coin collection with sound
  const handleCoin = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playCoinSound();
    coinsCollectedInGame.current += 1;
    addCoins(1);
  }, [addCoins, playCoinSound]);

  // Handle flap with sound
  const handleFlap = useCallback(() => {
    playFlapSound();
  }, [playFlapSound]);

  // Handle shield hit (saved by shield)
  const handleShieldHit = useCallback(() => {
    console.log('[Game] Shield absorbed hit!');
    // Update achievement stats for shield usage
    updateStats({ shieldUsed: true });
  }, [updateStats]);

  // Handle pause
  const handlePause = useCallback(() => {
    pauseGame();
  }, [pauseGame]);

  // Toggle mute
  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Skins handlers
  const handleOpenSkins = useCallback(() => {
    setShowSkins(true);
  }, []);

  const handleCloseSkins = useCallback(() => {
    setShowSkins(false);
  }, []);

  const handleSelectSkin = useCallback((skin) => {
    selectSkin(skin);
  }, [selectSkin]);

  const handleUnlockSkin = useCallback((skin) => {
    unlockSkin(skin);
    // Update achievement stats
    updateStats({ skinsUnlocked: unlockedSkins.length + 1 });
  }, [unlockSkin, unlockedSkins.length, updateStats]);

  // Leaderboard handlers
  const handleOpenLeaderboard = useCallback(() => {
    setShowLeaderboard(true);
  }, []);

  const handleCloseLeaderboard = useCallback(() => {
    setShowLeaderboard(false);
  }, []);

  // Achievements handlers
  const handleOpenAchievements = useCallback(() => {
    setShowAchievements(true);
  }, []);

  const handleCloseAchievements = useCallback(() => {
    setShowAchievements(false);
  }, []);

  // Handle achievement claim
  const handleClaimAchievement = useCallback((achievement) => {
    addCoins(achievement.reward);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [addCoins]);

  // Daily Rewards handlers
  const handleOpenDailyRewards = useCallback(() => {
    setShowDailyRewards(true);
  }, []);

  const handleCloseDailyRewards = useCallback(() => {
    setShowDailyRewards(false);
  }, []);

  const handleClaimDailyCoins = useCallback((amount, message) => {
    addCoins(amount);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('[Game] Daily reward claimed:', message, amount);
  }, [addCoins]);

  // Username/Profile handlers
  const handleOpenProfile = useCallback(() => {
    setShowUsernameModal(true);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setShowUsernameModal(false);
  }, []);

  const handleUsernameSaved = useCallback((newUsername) => {
    console.log('[Game] Username saved:', newUsername);
    // Trigger a sync to update backend with new username
    syncToCloud({
      highScore,
      coins,
      unlockedSkins,
      selectedSkin,
      ownedPowerUps,
      adsRemoved,
      totalGamesPlayed: achievementStats.gamesPlayed,
      totalCoinsEarned: achievementStats.totalCoinsEarned,
      unlockedAchievements,
      achievementStats,
    });
  }, [highScore, coins, unlockedSkins, selectedSkin, ownedPowerUps, adsRemoved, achievementStats, unlockedAchievements, syncToCloud]);

  // Power-up activation during gameplay
  const handleActivatePowerUp = useCallback((powerUpId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    activatePowerUp(powerUpId);
    // Update achievement stats
    updateStats({ powerupUsed: true });
    // Track for daily challenges
    usedPowerUpInGame.current = true;
  }, [activatePowerUp, updateStats]);

  return (
    <View style={styles.container}>
      {/* Background - Always visible */}
      <Background />

      {/* Game Canvas - Only during gameplay */}
      <GameCanvas
        onGameOver={handleGameOver}
        onScore={handleScore}
        onCoin={handleCoin}
        onFlap={handleFlap}
        onShieldHit={handleShieldHit}
        selectedSkin={selectedSkin}
      />

      {/* Game UI - Score, Pause button */}
      {gameState === 'playing' && (
        <GameUI
          score={score}
          highScore={highScore}
          coins={coins}
          coinMultiplier={coinMultiplier}
          onPause={handlePause}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          hasShield={hasShield}
          activePowerUps={activePowerUps}
        />
      )}

      {/* Power-up bar during gameplay */}
      {gameState === 'playing' && (
        <PowerUpBar
          ownedPowerUps={ownedPowerUps}
          activePowerUps={activePowerUps}
          onActivatePowerUp={handleActivatePowerUp}
        />
      )}

      {/* Start Screen */}
      {gameState === 'menu' && (
        <StartScreen
          onStart={handleStart}
          onOpenSkins={handleOpenSkins}
          onOpenLeaderboard={handleOpenLeaderboard}
          onOpenAchievements={handleOpenAchievements}
          onOpenDailyRewards={handleOpenDailyRewards}
          highScore={highScore}
          coins={coins}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          selectedSkin={selectedSkin}
          achievementProgress={`${getUnlockedCount()}/${getTotalCount()}`}
          currentStreak={currentStreak}
          hasUnclaimedStreak={!streakClaimedToday}
          displayName={getDisplayName()}
          onOpenProfile={handleOpenProfile}
        />
      )}

      {/* Game Over Panel */}
      {gameState === 'gameover' && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          coins={coins}
          isNewHighScore={score >= highScore && score > 0}
          canRevive={canRevive}
          onRetry={handleRetry}
          onRevive={handleRevive}
          onHome={handleHome}
        />
      )}

      {/* Achievement Unlock Notification */}
      <AchievementUnlockNotification
        achievement={newlyUnlocked}
        onDismiss={dismissNotification}
        onClaim={handleClaimAchievement}
      />

      {/* Banner Ad - Managed by AdsContext */}
      <BannerAdComponent />

      {/* Skins Modal */}
      <SkinsModal
        visible={showSkins}
        onClose={handleCloseSkins}
        coins={coins}
        selectedSkin={selectedSkin}
        unlockedSkins={unlockedSkins}
        onSelectSkin={handleSelectSkin}
        onUnlockSkin={handleUnlockSkin}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        visible={showLeaderboard}
        onClose={handleCloseLeaderboard}
        currentHighScore={highScore}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        visible={showAchievements}
        onClose={handleCloseAchievements}
      />

      {/* Daily Rewards Modal */}
      <DailyRewardsModal
        visible={showDailyRewards}
        onClose={handleCloseDailyRewards}
        onClaimCoins={handleClaimDailyCoins}
      />

      {/* Username/Profile Modal */}
      <UsernameModal
        visible={showUsernameModal}
        onClose={handleCloseProfile}
        onSave={handleUsernameSaved}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
});

export default FlappyFishGame;
