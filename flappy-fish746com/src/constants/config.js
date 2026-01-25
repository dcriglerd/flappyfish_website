// Google Mobile Ads Configuration
// The App IDs are configured in app.json
// Ad Unit IDs are configured here

export const AD_CONFIG = {
  // Use test IDs during development (set to false for production)
  USE_TEST_IDS: false,

  // Production Ad Unit IDs from AdMob
  PRODUCTION_IDS: {
    BANNER: {
      ANDROID: 'ca-app-pub-9210526164379066/2829853361',
      IOS: 'ca-app-pub-9210526164379066/2829853361',
    },
    INTERSTITIAL: {
      ANDROID: 'ca-app-pub-9210526164379066/1429141788',
      IOS: 'ca-app-pub-9210526164379066/1429141788',
    },
    REWARDED: {
      ANDROID: 'ca-app-pub-9210526164379066/7004902096',
      IOS: 'ca-app-pub-9210526164379066/7004902096',
    },
    // Additional ad formats (can be used later)
    REWARDED_INTERSTITIAL: {
      ANDROID: 'ca-app-pub-9210526164379066/4977504552',
      IOS: 'ca-app-pub-9210526164379066/4977504552',
    },
    APP_OPEN: {
      ANDROID: 'ca-app-pub-9210526164379066/3250641298',
      IOS: 'ca-app-pub-9210526164379066/3250641298',
    },
    NATIVE: {
      ANDROID: 'ca-app-pub-9210526164379066/6204107699',
      IOS: 'ca-app-pub-9210526164379066/6204107699',
    },
  },

  // Interstitial frequency (show every N game overs) - increased to reduce interruptions
  INTERSTITIAL_FREQUENCY: 5,
  
  // Interstitial on game START frequency (show every N game starts)
  INTERSTITIAL_START_FREQUENCY: 3,
  
  // App Open ad cooldown in milliseconds (2 minutes)
  APP_OPEN_COOLDOWN: 120000,
  
  // Disable App Open ads completely (set to true to disable)
  DISABLE_APP_OPEN_ADS: true,
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
