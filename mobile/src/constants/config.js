// Google Mobile Ads Configuration
// The App IDs are configured in app.json
// Ad Unit IDs are configured here

export const AD_CONFIG = {
  // Use test IDs during development (set to false for production)
  USE_TEST_IDS: true,

  // Production Ad Unit IDs (replace with your real AdMob IDs)
  // Create these at https://admob.google.com
  PRODUCTION_IDS: {
    BANNER: {
      ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    INTERSTITIAL: {
      ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    REWARDED: {
      ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
  },

  // Interstitial frequency (show every N game overs)
  INTERSTITIAL_FREQUENCY: 3,
};

// Game Configuration
export const GAME_CONFIG = {
  GRAVITY: 0.25,
  FLAP_FORCE: -6,
  OBSTACLE_SPEED: 2,
  OBSTACLE_INTERVAL: 2200,
  GAP_HEIGHT: 190,
  FISH_SIZE: 40,
};

// Colors
export const COLORS = {
  PRIMARY: '#00b4d8',
  SECONDARY: '#0096c7',
  BACKGROUND: '#00d4ff',
  DARK_BLUE: '#0077b6',
  GOLD: '#FFD700',
  ORANGE: '#ff6b35',
  GREEN: '#22c55e',
  SAND: '#f4d03f',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
};
