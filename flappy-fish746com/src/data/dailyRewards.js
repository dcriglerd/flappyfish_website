// Daily Rewards Data for Flappy Fish

// Streak reward tiers - rewards for consecutive days played
export const STREAK_REWARDS = [
  { day: 1, coins: 10, description: 'Day 1 Bonus' },
  { day: 2, coins: 15, description: 'Day 2 Bonus' },
  { day: 3, coins: 25, description: 'Day 3 Bonus' },
  { day: 4, coins: 35, description: 'Day 4 Bonus' },
  { day: 5, coins: 50, description: 'Day 5 Bonus' },
  { day: 6, coins: 75, description: 'Day 6 Bonus' },
  { day: 7, coins: 150, special: 'mystery_box', description: 'Week Complete! 🎁' },
];

// After day 7, cycle repeats with bonus multiplier
export const getStreakReward = (day) => {
  const cycleDay = ((day - 1) % 7) + 1;
  const cycleMultiplier = Math.floor((day - 1) / 7) + 1;
  const baseReward = STREAK_REWARDS.find(r => r.day === cycleDay);
  
  return {
    ...baseReward,
    coins: Math.floor(baseReward.coins * (1 + (cycleMultiplier - 1) * 0.5)),
    cycle: cycleMultiplier,
  };
};

// Challenge types and templates
export const CHALLENGE_TYPES = {
  SCORE: 'score',
  COINS: 'coins',
  GAMES: 'games',
  POWERUP: 'powerup',
  NO_POWERUP: 'no_powerup',
  PERFECT: 'perfect',
};

// Challenge templates with difficulty tiers
export const CHALLENGE_TEMPLATES = [
  // Score challenges
  { type: CHALLENGE_TYPES.SCORE, target: 5, reward: 15, description: 'Score 5 points in a single game', icon: '🎯' },
  { type: CHALLENGE_TYPES.SCORE, target: 10, reward: 25, description: 'Score 10 points in a single game', icon: '🎯' },
  { type: CHALLENGE_TYPES.SCORE, target: 15, reward: 40, description: 'Score 15 points in a single game', icon: '🎯' },
  { type: CHALLENGE_TYPES.SCORE, target: 25, reward: 60, description: 'Score 25 points in a single game', icon: '🏆' },
  
  // Coin challenges
  { type: CHALLENGE_TYPES.COINS, target: 10, reward: 20, description: 'Collect 10 coins today', icon: '🪙' },
  { type: CHALLENGE_TYPES.COINS, target: 25, reward: 35, description: 'Collect 25 coins today', icon: '🪙' },
  { type: CHALLENGE_TYPES.COINS, target: 50, reward: 50, description: 'Collect 50 coins today', icon: '💰' },
  
  // Games played challenges
  { type: CHALLENGE_TYPES.GAMES, target: 3, reward: 15, description: 'Play 3 games today', icon: '🎮' },
  { type: CHALLENGE_TYPES.GAMES, target: 5, reward: 25, description: 'Play 5 games today', icon: '🎮' },
  { type: CHALLENGE_TYPES.GAMES, target: 10, reward: 50, description: 'Play 10 games today', icon: '🎮' },
  
  // Power-up challenges
  { type: CHALLENGE_TYPES.POWERUP, target: 1, reward: 20, description: 'Use a power-up in a game', icon: '⚡' },
  { type: CHALLENGE_TYPES.POWERUP, target: 3, reward: 40, description: 'Use 3 power-ups today', icon: '⚡' },
  
  // Skill challenges
  { type: CHALLENGE_TYPES.NO_POWERUP, target: 10, reward: 50, description: 'Score 10 without power-ups', icon: '💪' },
  { type: CHALLENGE_TYPES.PERFECT, target: 5, reward: 35, description: 'Pass 5 obstacles without collecting coins', icon: '🏃' },
];

// Generate random daily challenges (3 challenges, varied difficulty)
export const generateDailyChallenges = (seed) => {
  // Use seed for deterministic random (same challenges for same day)
  const seededRandom = (index) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };
  
  // Separate challenges by difficulty (based on reward)
  const easy = CHALLENGE_TEMPLATES.filter(c => c.reward <= 25);
  const medium = CHALLENGE_TEMPLATES.filter(c => c.reward > 25 && c.reward <= 40);
  const hard = CHALLENGE_TEMPLATES.filter(c => c.reward > 40);
  
  // Pick one from each tier
  const challenges = [
    { ...easy[Math.floor(seededRandom(0) * easy.length)], id: 'daily_1' },
    { ...medium[Math.floor(seededRandom(1) * medium.length)], id: 'daily_2' },
    { ...hard[Math.floor(seededRandom(2) * hard.length)], id: 'daily_3' },
  ];
  
  return challenges;
};

// Calculate bonus for completing all daily challenges
export const ALL_CHALLENGES_BONUS = 50;

// Get time until next daily reset (midnight UTC)
export const getTimeUntilReset = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
};

// Get today's date string (UTC) for comparison
export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// Check if date is yesterday
export const isYesterday = (dateString) => {
  if (!dateString) return false;
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
};

// Check if date is today
export const isToday = (dateString) => {
  if (!dateString) return false;
  return dateString === getTodayDateString();
};
