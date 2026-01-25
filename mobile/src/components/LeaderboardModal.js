import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../constants/config';
import { useCloudSync } from '../context/CloudSyncContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LeaderboardModal = ({ visible, onClose, currentHighScore }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const { getLeaderboard, getUserRank, userId } = useCloudSync();

  // Fetch leaderboard data
  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Fetch leaderboard
      const leaderboardResult = await getLeaderboard(100);
      if (leaderboardResult.success) {
        setLeaderboard(leaderboardResult.data || []);
      } else {
        throw new Error(leaderboardResult.error || 'Failed to load leaderboard');
      }

      // Fetch user's rank
      const rankResult = await getUserRank();
      if (rankResult.success && rankResult.data) {
        setUserRank(rankResult.data);
      }
    } catch (err) {
      console.error('[Leaderboard] Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getLeaderboard, getUserRank]);

  // Fetch data when modal opens
  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible, fetchData]);

  // Render leaderboard item
  const renderItem = useCallback(({ item, index }) => {
    const isCurrentUser = item.user_id === userId;
    const rank = item.rank || index + 1;
    
    // Medal for top 3
    let medalEmoji = '';
    if (rank === 1) medalEmoji = '🥇';
    else if (rank === 2) medalEmoji = '🥈';
    else if (rank === 3) medalEmoji = '🥉';

    return (
      <View style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          {medalEmoji ? (
            <Text style={styles.medalEmoji}>{medalEmoji}</Text>
          ) : (
            <Text style={styles.rankText}>{rank}</Text>
          )}
        </View>
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, isCurrentUser && styles.currentUserText]}>
            {isCurrentUser ? '👤 You' : `Player ${item.user_id.slice(-6)}`}
          </Text>
          {item.username && (
            <Text style={styles.username}>@{item.username}</Text>
          )}
        </View>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, isCurrentUser && styles.currentUserText]}>
            {item.high_score.toLocaleString()}
          </Text>
          <Text style={styles.scoreLabel}>pts</Text>
        </View>
      </View>
    );
  }, [userId]);

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🏆</Text>
        <Text style={styles.emptyText}>No players yet!</Text>
        <Text style={styles.emptySubtext}>Be the first to set a high score</Text>
      </View>
    );
  };

  // Render header with user's rank
  const renderHeader = () => {
    if (!userRank || !userRank.rank) return null;

    return (
      <View style={styles.userRankCard}>
        <Text style={styles.userRankLabel}>Your Rank</Text>
        <View style={styles.userRankRow}>
          <Text style={styles.userRankNumber}>#{userRank.rank}</Text>
          <View style={styles.userRankDivider} />
          <View>
            <Text style={styles.userRankScore}>{userRank.high_score?.toLocaleString() || currentHighScore}</Text>
            <Text style={styles.userRankScoreLabel}>High Score</Text>
          </View>
        </View>
      </View>
    );
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
            <Text style={styles.headerTitle}>🏆 LEADERBOARD</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.GOLD} />
              <Text style={styles.loadingText}>Loading leaderboard...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorEmoji}>😕</Text>
              <Text style={styles.errorText}>Couldn't load leaderboard</Text>
              <Text style={styles.errorSubtext}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => fetchData()}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={leaderboard}
              renderItem={renderItem}
              keyExtractor={(item) => item.user_id}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={renderEmpty}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={() => fetchData(true)}
                  tintColor={COLORS.GOLD}
                  colors={[COLORS.GOLD]}
                />
              }
            />
          )}
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
    backgroundColor: '#1e3a5f',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: COLORS.GOLD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#78350f',
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
    color: '#78350f',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 16,
    fontSize: 14,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.GOLD,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#78350f',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  userRankCard: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderWidth: 2,
    borderColor: COLORS.GOLD,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  userRankLabel: {
    color: COLORS.GOLD,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRankNumber: {
    color: COLORS.GOLD,
    fontSize: 36,
    fontWeight: '900',
  },
  userRankDivider: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255,215,0,0.3)',
    marginHorizontal: 16,
  },
  userRankScore: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: '700',
  },
  userRankScoreLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  currentUserItem: {
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.5)',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '700',
  },
  medalEmoji: {
    fontSize: 24,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    color: COLORS.WHITE,
    fontSize: 15,
    fontWeight: '600',
  },
  currentUserText: {
    color: '#4ade80',
  },
  username: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '800',
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
});

export default LeaderboardModal;
