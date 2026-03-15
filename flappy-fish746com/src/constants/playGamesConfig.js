// Google Play Games Services Configuration
// Replace these IDs with your actual IDs from Play Console

export const PLAY_GAMES_CONFIG = {
  // Leaderboard IDs - Create these in Play Console > Play Games Services > Leaderboards
  LEADERBOARDS: {
    HIGH_SCORE: 'CgkI_YOUR_LEADERBOARD_ID', // Replace with your leaderboard ID
  },

  // Achievement IDs - Create these in Play Console > Play Games Services > Achievements
  ACHIEVEMENTS: {
    FIRST_GAME: 'CgkI_YOUR_ACHIEVEMENT_ID_1',      // First game played
    SCORE_10: 'CgkI_YOUR_ACHIEVEMENT_ID_2',        // Score 10 points
    SCORE_50: 'CgkI_YOUR_ACHIEVEMENT_ID_3',        // Score 50 points
    SCORE_100: 'CgkI_YOUR_ACHIEVEMENT_ID_4',       // Score 100 points
    COLLECTOR: 'CgkI_YOUR_ACHIEVEMENT_ID_5',       // Collect 100 coins
    SKIN_UNLOCKED: 'CgkI_YOUR_ACHIEVEMENT_ID_6',   // Unlock first skin
    STREAK_MASTER: 'CgkI_YOUR_ACHIEVEMENT_ID_7',   // 50 tap streak
  },
};

// Instructions:
// 1. Go to Google Play Console > Flappy Fish > Play Games Services > Leaderboards
// 2. Create a leaderboard called "High Score"
// 3. Copy the Leaderboard ID and paste it above
// 4. Go to Achievements and create achievements
// 5. Copy each Achievement ID and paste above
