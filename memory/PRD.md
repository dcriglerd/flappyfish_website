# Flappy Fish - Product Requirements Document

## Original Problem Statement
Build a "Flappy Bird" clone named "Flappy Fish" as a React Native mobile application for Android, with monetization through Google AdMob ads.

## Core Requirements
1. **Core Gameplay:** Tap-to-swim mechanics (Flappy Bird clone)
2. **Monetization:** In-game ads (Banner, Interstitial, Rewarded, App Open) via Google AdMob
3. **Features:**
   - Power-ups
   - Unlockable fish skins
   - Cloud data sync via FastAPI/MongoDB backend
   - Leaderboard
   - Achievements system
   - Daily Rewards
   - Push Notifications
   - "Best Taps" streak counter
   - Interactive Tutorial
   - Welcome Back Bonus
4. **Platform:** React Native (Expo) for Google Play, Amazon Appstore, Samsung Galaxy Store
5. **Website:** Promotional landing page at flappyfish746.com

## Tech Stack
- **Frontend:** React Native (Expo), EAS Build
- **Backend:** FastAPI, MongoDB
- **State Management:** React Context API
- **Ads:** react-native-google-mobile-ads (AdMob)
- **Deployment:** GitHub Pages (website), EAS Build (app)

## Database Schema
- **Collection:** `game_data`
  - `user_id: string`, `username: string`, `high_score: int`, `coins: int`
  - `unlocked_skins: list`, `unlocked_achievements: list`
  - `best_tap_streak: int`, `updated_at: datetime`

---

## What's Been Implemented

### December 2024
- [x] Core gameplay mechanics
- [x] All ad types (Banner, Interstitial, Rewarded, App Open)
- [x] Fish skins system
- [x] Power-ups system
- [x] Cloud sync with backend
- [x] Leaderboard
- [x] Achievements system
- [x] Daily Rewards
- [x] Push Notifications
- [x] Interactive Tutorial
- [x] Welcome Back Bonus
- [x] Legal pages (Privacy Policy, Terms of Service, Data Deletion)
- [x] Promotional website with deep linking
- [x] Google Play submission (Closed Testing)
- [x] Amazon Appstore (Live - with device compatibility issues)
- [x] **FIXED: Interruptive Interstitial Ads Policy Violation (v17)**
  - Removed interstitial ads on game start
  - Disabled App Open ad on initial launch
  - Increased delay before showing interstitial on game over
  - Reduced ad frequency to every 3 game overs

---

## Current Status

### P0 - Critical (Blocking Production)
- [x] ~~Fix Interruptive Interstitial Ads~~ - FIXED in v17
- [ ] Build AAB v17 and submit to Google Play
- [ ] Get Google Play Production approval

### P1 - High Priority
- [ ] Amazon Appstore: Exclude Fire TV devices from listing
- [ ] Verify data-deletion.html is live at flappyfish746.com

### P2 - Medium Priority
- [ ] Samsung Galaxy Store: Requires Corporate Commercial Seller account upgrade
- [ ] Launch Google Ads campaign (after production approval)

---

## Backlog / Future Tasks
- Social features (share high scores)
- iOS version
- New fish skins and power-ups
- Seasonal events
- App performance monitoring post-launch

---

## Key Files Reference
- **Ad Logic:** `/app/flappy-fish746com/src/context/AdsContext.js`
- **Game Logic:** `/app/flappy-fish746com/src/screens/FlappyFishGame.js`
- **Config:** `/app/flappy-fish746com/src/constants/config.js`
- **App Config:** `/app/flappy-fish746com/app.json`
- **Website:** `/app/flappy-fish746com/website/`
- **Backend:** `/app/backend/server.py`
