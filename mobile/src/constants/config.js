// Google Mobile Ads Configuration
// Replace with your actual AdMob IDs for production

export const AD_CONFIG = {
  // Test IDs (safe to use during development)
  TEST_IDS: {
    BANNER: {
      ANDROID: 'ca-app-pub-3940256099942544/6300978111',
      IOS: 'ca-app-pub-3940256099942544/2934735716',
    },
    INTERSTITIAL: {
      ANDROID: 'ca-app-pub-3940256099942544/1033173712',
      IOS: 'ca-app-pub-3940256099942544/4411468910',
    },
    REWARDED: {
      ANDROID: 'ca-app-pub-3940256099942544/5224354917',
      IOS: 'ca-app-pub-3940256099942544/1712485313',
    },
  },

  // Production IDs (replace with your actual AdMob IDs)
  PRODUCTION_IDS: {
    BANNER: {
      ANDROID: 'YOUR_ANDROID_BANNER_ID',
      IOS: 'YOUR_IOS_BANNER_ID',
    },
    INTERSTITIAL: {
      ANDROID: 'YOUR_ANDROID_INTERSTITIAL_ID',
      IOS: 'YOUR_IOS_INTERSTITIAL_ID',
    },
    REWARDED: {
      ANDROID: 'YOUR_ANDROID_REWARDED_ID',
      IOS: 'YOUR_IOS_REWARDED_ID',
    },
  },

  // Set to false for production
  USE_TEST_IDS: true,

  // Interstitial frequency (show every N deaths)
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