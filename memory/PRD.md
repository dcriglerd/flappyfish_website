# Flappy Fish - Product Requirements Document

## Original Problem Statement
Build a "Flappy Bird" clone named "Flappy Fish" with:
- Tap-to-swim mechanics
- Monetization (in-app purchases for coins, removing ads)
- In-game ads (banner and interstitial)
- Power-ups (Bubble Shield, Slow Motion, Coin Magnet, Double Coins)
- Unlockable fish skins
- Underwater theme with custom graphics

## Platform
- **Primary:** React Native Mobile App (Expo)
- **Secondary:** Web App (React)

## What's Been Implemented

### Web App (`/app/frontend`) - COMPLETE
- ✅ Core Flappy Bird gameplay (HTML5 Canvas)
- ✅ Underwater theme with parallax scrolling
- ✅ 2D fish character with multiple skins
- ✅ Shop modal with coin packages (MOCKED)
- ✅ Skins modal for character customization
- ✅ Mock ads manager (banner + interstitial)
- ✅ High score and coin tracking (localStorage)
- ✅ Responsive design for mobile/desktop

### Mobile App (`/app/mobile`) - COMPLETE (Expo Go Compatible)
- ✅ Full game ported to React Native
- ✅ SVG fish character rendering
- ✅ Animated underwater background with bubbles
- ✅ Obstacle spawning and collision detection
- ✅ Coin collection system
- ✅ Haptic feedback on tap/score/collect
- ✅ High score persistence (AsyncStorage)
- ✅ Start screen with stats display
- ✅ Game over screen with retry/revive options
- ✅ Mocked ads for Expo Go compatibility
- ✅ Compatible with Expo SDK 50

## Current Architecture

### Mobile App Structure
```
/app/mobile/
├── App.js                    # Entry point with all context providers
├── src/
│   ├── components/           # UI Components
│   │   ├── Background.js     # Animated underwater scene
│   │   ├── Fish.js           # SVG fish character  
│   │   ├── Obstacle.js       # Coral reef pipes
│   │   ├── Coin.js           # Collectible coins
│   │   ├── GameCanvas.js     # Main game loop
│   │   ├── GameUI.js         # HUD (score, pause)
│   │   ├── StartScreen.js    # Main menu
│   │   ├── GameOverScreen.js # End game modal
│   │   ├── BannerAdComponent.js
│   │   ├── ShopModal.js      # In-app purchases
│   │   ├── SkinsModal.js     # Fish skin selection
│   │   ├── LeaderboardModal.js # Global rankings
│   │   ├── AchievementsModal.js # Achievement tracking
│   │   ├── AchievementUnlockNotification.js # Unlock popup
│   │   ├── DailyRewardsModal.js # Streaks & challenges
│   │   └── PowerUpBar.js     # Active power-ups
│   ├── context/
│   │   ├── GameContext.js    # Game state & logic
│   │   ├── AdsContext.js     # Google AdMob
│   │   ├── AudioContext.js   # Sound effects
│   │   ├── PurchasesContext.js # RevenueCat IAP
│   │   ├── CloudSyncContext.js # Backend sync & leaderboard
│   │   ├── AchievementsContext.js # Achievement tracking
│   │   ├── DailyRewardsContext.js # Streaks & daily challenges
│   │   └── NotificationsContext.js # Push notifications
│   ├── data/
│   │   ├── gameData.js       # Skins & power-ups
│   │   ├── achievements.js   # Achievement definitions
│   │   └── dailyRewards.js   # Streak & challenge configs
│   ├── constants/
│   │   └── config.js         # Game config & Ad IDs
│   └── screens/
│       └── FlappyFishGame.js # Main screen
```

### Backend Architecture
```
/app/backend/
└── server.py                 # FastAPI with MongoDB
    ├── /api/game/sync        # Sync all game data
    ├── /api/game/{user_id}   # Get user data
    ├── /api/leaderboard      # Global rankings
    └── /api/purchases        # IAP records
```

### Key Dependencies (Expo Go Compatible)
- expo: ~50.0.0
- react-native: 0.73.6
- react-native-svg: 14.1.0
- expo-haptics: ~12.8.0
- expo-av: ~13.10.0
- @react-native-async-storage/async-storage: 1.21.0

## Game Configuration
Located in `/app/mobile/src/constants/config.js`:
- GRAVITY: 0.25
- FLAP_FORCE: -6
- OBSTACLE_SPEED: 2
- OBSTACLE_INTERVAL: 2200ms
- GAP_HEIGHT: 190px

## Testing Instructions
1. Install Expo Go on your phone
2. Run `cd /app/mobile && npx expo start`
3. Scan QR code with Expo Go app
4. Tap screen to play!

## P0 - Completed
- [x] Convert web game to React Native
- [x] Make Expo Go compatible
- [x] Core gameplay mechanics
- [x] Basic UI (start, game over, HUD)

## P1 - Upcoming Tasks
- [ ] Configure RevenueCat products in dashboard
- [ ] Test full flow on physical device

## Recently Completed
- [x] Sound effects system (expo-av) - Dec 2025
  - Flap/swim bubble sound
  - Coin collection sparkle
  - Score arpeggio
  - Game over descending tone
  - Mute toggle on StartScreen and GameUI

- [x] Google AdMob Integration - Dec 2025
  - Banner, Interstitial, Rewarded ads
  - Production Ad Unit IDs configured

- [x] Shop Modal - Dec 2025
  - Coin packages (100/500/1000 coins)
  - Remove Ads option
  - Power-ups (Bubble Shield, Slow Motion, Coin Magnet, Double Coins)
  - Tab-based UI (Coins / Power-ups)

- [x] Skins Modal - Dec 2025
  - 6 fish skins (Goldie, Nemo, Azure, Mystic, Prisma, Emerald)
  - Unlock with coins
  - Select/equip skins
  - SVG fish preview with color

- [x] Power-Up System - Dec 2025
  - Bubble Shield: Protects from one hit (shows bubble around fish)
  - Slow Motion: Slows obstacles to 50% speed (blue overlay)
  - Coin Magnet: Attracts coins within radius (purple glow on coins)
  - Double Coins: 2x coin multiplier (x2 badge in UI)
  - PowerUpBar component during gameplay
  - Active power-up indicators in GameUI

- [x] App Open Ads - Dec 2025
  - Shows on app launch after 2 second delay
  - Shows when app returns from background (30s cooldown)
  - Uses production App Open ad unit ID

- [x] RevenueCat IAP Integration - Dec 2025
  - Installed `react-native-purchases` SDK
  - PurchasesContext for state management
  - Test API key configured: `test_NABQGDjFGFjEYgtuLvYsspaTccY`
  - Products: coins_100, coins_500, coins_1000, remove_ads
  - Restore purchases functionality
  - Updated ShopModal with real IAP integration

- [x] Backend API for Cloud Sync - Dec 2025
  - FastAPI backend with MongoDB
  - Endpoints:
    - POST /api/game/sync - Sync game data
    - GET /api/game/{user_id} - Get user data
    - POST /api/game/{user_id}/coins/add - Add coins
    - POST /api/game/{user_id}/highscore - Update high score
    - GET /api/leaderboard - Get top players
    - GET /api/leaderboard/{user_id}/rank - Get user rank
    - POST /api/purchases/record - Record purchases
    - POST /api/webhook/revenuecat - RevenueCat webhook
  - CloudSyncContext for mobile app

- [x] Leaderboard UI - Dec 2025
  - LeaderboardModal component with top 100 players
  - User rank display card
  - Pull-to-refresh functionality
  - Medal emojis for top 3 (🥇🥈🥉)
  - Current user highlighting
  - Connected to backend API
  - Auto-sync on game over

- [x] Achievements System - Dec 2025
  - 17 achievements across categories:
    - Score-based (1, 10, 25, 50, 100 points)
    - Coins collected (100, 500, 1000 total)
    - Games played (10, 50, 100 games)
    - Skins unlocked (first skin, all skins)
    - Power-ups used
    - Special challenges
  - AchievementsContext for state management
  - AchievementsModal with progress bars
  - Achievement unlock notification popup
  - Coin rewards for completing achievements
  - Progress tracking persisted to AsyncStorage
  - Cloud sync integration for achievements persistence

- [x] Full Cloud Sync Integration - Jan 2025
  - CloudSyncContext with auto-generated user IDs
  - Cloud data loaded on app start
  - Game data synced on game over (high score, coins, achievements)
  - Backend API supports achievement_stats and unlocked_achievements fields
  - Intelligent data merging (keeps higher values, combines unlocks)

- [x] Daily Rewards System - Jan 2025
  - **Daily Streak:**
    - Track consecutive days played
    - Escalating rewards (Day 1: 10 coins → Day 7: 150 coins + bonus)
    - Streak counter on start screen with glow effect
    - Weekly cycle with multiplier for long streaks
  - **Daily Challenges:**
    - 3 random challenges daily (easy/medium/hard)
    - Challenge types: score, coins, games played, power-ups, special
    - Progress bars with real-time tracking
    - Bonus reward (+50 coins) for completing all 3
  - Countdown timer shows time until daily reset (UTC midnight)
  - DailyRewardsContext for state management
  - DailyRewardsModal with tabbed UI (Streak / Challenges)
  - Persisted to AsyncStorage with daily refresh logic

- [x] Push Notifications - Jan 2025
  - **Streak Reminders:**
    - Daily reminder at 8 PM to play and maintain streak
    - Random motivational messages
  - **Streak Warnings:**
    - Urgent notification at 10 PM if player hasn't played
    - Warns about losing streak at midnight
  - **Challenge Reminders:**
    - Notification at 6 PM about incomplete daily challenges
  - NotificationsContext for state management
  - NotificationSettings component (compact mode for modals)
  - Toggle on/off in Daily Rewards modal
  - Uses expo-notifications for scheduling
  - Android notification channels configured

## P1 - Upcoming Tasks
- [ ] User Authentication - Replace device-based user ID with proper auth
- [ ] Finalize IAP with Production Keys

## P2 - Future Tasks
- [ ] User Profile/Username for leaderboard
- [ ] Social features (friends, sharing)

## Recently Completed - Google AdMob Integration (Dec 2025)
- [x] Added `react-native-google-mobile-ads` package
- [x] Configured app.json with AdMob App IDs (test IDs)
- [x] Created real AdsContext with InterstitialAd, RewardedAd, BannerAd
- [x] BannerAdComponent uses ANCHORED_ADAPTIVE_BANNER
- [x] Interstitial shows every 3 game overs
- [x] Rewarded ad for revive feature
- [x] Created eas.json for development builds
- [x] App initializes Google Mobile Ads SDK on startup

### Build Instructions
```bash
cd /app/mobile
eas login
eas build --platform android --profile development
```

## Notes
- **MOCKED:** User authentication uses device-generated UUID (not proper auth)
- Real ads require `react-native-google-mobile-ads` which needs a development build (not compatible with Expo Go)

---
Last Updated: January 2025
