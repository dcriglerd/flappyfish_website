// Achievements data for Flappy Fish

export const ACHIEVEMENTS = [
  // Score-based achievements
  {
    id: 'first_point',
    name: 'Getting Started',
    description: 'Score your first point',
    icon: '⭐',
    requirement: { type: 'score', value: 1 },
    reward: 10,
  },
  {
    id: 'score_10',
    name: 'Warming Up',
    description: 'Score 10 points in a single game',
    icon: '🔥',
    requirement: { type: 'score', value: 10 },
    reward: 25,
  },
  {
    id: 'score_25',
    name: 'On Fire',
    description: 'Score 25 points in a single game',
    icon: '💪',
    requirement: { type: 'score', value: 25 },
    reward: 50,
  },
  {
    id: 'score_50',
    name: 'Expert Swimmer',
    description: 'Score 50 points in a single game',
    icon: '🏆',
    requirement: { type: 'score', value: 50 },
    reward: 100,
  },
  {
    id: 'score_100',
    name: 'Fish Legend',
    description: 'Score 100 points in a single game',
    icon: '👑',
    requirement: { type: 'score', value: 100 },
    reward: 250,
  },

  // Coin-based achievements
  {
    id: 'coins_100',
    name: 'Coin Collector',
    description: 'Collect 100 total coins',
    icon: '🪙',
    requirement: { type: 'total_coins', value: 100 },
    reward: 20,
  },
  {
    id: 'coins_500',
    name: 'Treasure Hunter',
    description: 'Collect 500 total coins',
    icon: '💰',
    requirement: { type: 'total_coins', value: 500 },
    reward: 50,
  },
  {
    id: 'coins_1000',
    name: 'Golden Fish',
    description: 'Collect 1000 total coins',
    icon: '🏅',
    requirement: { type: 'total_coins', value: 1000 },
    reward: 100,
  },

  // Games played achievements
  {
    id: 'games_10',
    name: 'Regular Player',
    description: 'Play 10 games',
    icon: '🎮',
    requirement: { type: 'games_played', value: 10 },
    reward: 15,
  },
  {
    id: 'games_50',
    name: 'Dedicated',
    description: 'Play 50 games',
    icon: '🎯',
    requirement: { type: 'games_played', value: 50 },
    reward: 50,
  },
  {
    id: 'games_100',
    name: 'Addicted',
    description: 'Play 100 games',
    icon: '🐠',
    requirement: { type: 'games_played', value: 100 },
    reward: 100,
  },

  // Skin-based achievements
  {
    id: 'unlock_skin',
    name: 'Fashion Fish',
    description: 'Unlock your first skin',
    icon: '✨',
    requirement: { type: 'skins_unlocked', value: 2 },
    reward: 25,
  },
  {
    id: 'unlock_all_skins',
    name: 'Collector',
    description: 'Unlock all fish skins',
    icon: '🌈',
    requirement: { type: 'skins_unlocked', value: 6 },
    reward: 200,
  },

  // Power-up achievements
  {
    id: 'use_powerup',
    name: 'Power Player',
    description: 'Use a power-up for the first time',
    icon: '⚡',
    requirement: { type: 'powerups_used', value: 1 },
    reward: 15,
  },
  {
    id: 'use_shield',
    name: 'Survivor',
    description: 'Get saved by a bubble shield',
    icon: '🛡️',
    requirement: { type: 'shields_used', value: 1 },
    reward: 30,
  },

  // Special achievements
  {
    id: 'no_coins_10',
    name: 'Speed Runner',
    description: 'Score 10 without collecting any coins',
    icon: '🏃',
    requirement: { type: 'score_no_coins', value: 10 },
    reward: 75,
  },
  {
    id: 'perfect_5',
    name: 'Close Call',
    description: 'Pass 5 obstacles in a row without any power-ups',
    icon: '😅',
    requirement: { type: 'consecutive_no_powerup', value: 5 },
    reward: 40,
  },
];

// Helper to get achievement by ID
export const getAchievementById = (id) => {
  return ACHIEVEMENTS.find(a => a.id === id);
};

// Helper to get unlocked achievements
export const getUnlockedAchievements = (unlockedIds) => {
  return ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));
};

// Helper to get locked achievements
export const getLockedAchievements = (unlockedIds) => {
  return ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id));
};

// Calculate total rewards from achievements
export const getTotalRewards = (unlockedIds) => {
  return ACHIEVEMENTS
    .filter(a => unlockedIds.includes(a.id))
    .reduce((sum, a) => sum + a.reward, 0);
};
