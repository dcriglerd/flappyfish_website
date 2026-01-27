# Flappy Fish - Product Requirements Document

## Original Problem Statement
Build a "Flappy Bird" clone named "Flappy Fish" as a React Native mobile application with monetization through Google AdMob ads.

## Project Overview
- **Platform:** React Native (Expo) mobile app
- **Backend:** FastAPI + MongoDB for cloud sync and leaderboards
- **Monetization:** Google AdMob (Banner, Interstitial, Rewarded, App Open ads)

## Core Features

### Gameplay
- Tap-to-swim mechanics
- Obstacle avoidance (pipes)
- Coin collection
- Score tracking

### Customization
- 6 unlockable fish skins (Golden, Neon, Rainbow, etc.)
- Skins purchased with in-game coins

### Power-Ups
- Bubble Shield - Survive one hit
- Slow Motion - Slows game speed
- Coin Magnet - Attracts coins
- Double Coins - 2x coin multiplier

### Progression
- Cloud data sync (high score, coins, unlocks)
- Global leaderboard with usernames
- 15+ achievements with rewards
- Daily rewards with streak system
- Push notification reminders

### Monetization
- Banner ads (menu & game over screens)
- Interstitial ads (every 2 deaths, every 2 game starts)
- Rewarded ads (watch to revive)
- App Open ads (on launch, 1 min cooldown)

## What's Been Implemented

### January 2025
- [x] Core game mechanics and UI
- [x] All fish skins and power-ups
- [x] Cloud sync with FastAPI/MongoDB backend
- [x] Global leaderboard with usernames
- [x] Achievements system (15+ achievements)
- [x] Daily rewards with streaks
- [x] Push notifications for daily reminders
- [x] Google AdMob integration (all ad types)
- [x] Shop/IAP removal (user requested)
- [x] Ad frequency optimization
- [x] Landing page website created
- [x] Privacy policy created
- [x] Google Play Store assets (icon, screenshots, descriptions)
- [x] Production AAB built for Play Store submission

## Technical Architecture

```
/app/
├── backend/
│   └── server.py             # FastAPI backend
└── flappy-fish746com/        # React Native mobile app
    ├── src/
    │   ├── components/       # UI components
    │   ├── constants/
    │   │   └── config.js     # Ad Unit IDs, game config
    │   ├── context/          # State management
    │   │   ├── AdsContext.js
    │   │   ├── GameContext.js
    │   │   ├── AuthContext.js
    │   │   ├── CloudSyncContext.js
    │   │   ├── AchievementsContext.js
    │   │   └── DailyRewardsContext.js
    │   ├── data/
    │   └── screens/
    │       └── FlappyFishGame.js
    └── website/              # Landing page for flappyfish746.com
        ├── index.html
        ├── privacy-policy.html
        └── ads.txt
```

## Database Schema
**Collection:** `game_data`
- `user_id: string` (Primary Key - device ID)
- `username: string`
- `high_score: int`
- `coins: int`
- `unlocked_skins: list`
- `unlocked_achievements: list`
- `achievement_stats: dict`
- `updated_at: datetime`

## API Endpoints
- `POST /api/gamedata/` - Save user game data
- `GET /api/gamedata/{user_id}/` - Load user game data
- `GET /api/leaderboard/` - Get global high scores

## Ad Configuration
```javascript
INTERSTITIAL_FREQUENCY: 2        // Every 2 deaths
INTERSTITIAL_START_FREQUENCY: 2  // Every 2 game starts
APP_OPEN_COOLDOWN: 60000         // 1 minute cooldown
DISABLE_APP_OPEN_ADS: false      // Enabled
```

## Pending Tasks (P0)
1. User to test new APK with improved ad frequency
2. Deploy website to Cloudflare Pages
3. Submit app to Google Play Store
4. Update Play Store with website URLs

## Future Enhancements (P1)
- Onboarding/Tutorial for new players
- Social features (share high scores)
- iOS version

## Assets & Links
- **Latest APK:** https://expo.dev/accounts/dcriglerd/projects/flappy-fish746com/builds/1b9b83a0-9b42-42fb-85d4-af90521e02da
- **Production AAB:** https://expo.dev/artifacts/eas/cKhKRk42vuxpnyZZkwVg4u.aab
- **Domain:** https://flappyfish746.com
- **AdMob Publisher ID:** pub-9210526164379066
