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
├── App.js                    # Entry point
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
│   │   └── BannerAdComponent.js
│   ├── context/
│   │   ├── GameContext.js    # Game state
│   │   └── AdsContext.js     # Mocked ads
│   ├── constants/
│   │   └── config.js         # Game config
│   └── screens/
│       └── FlappyFishGame.js # Main screen
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
- [ ] Implement power-up effects in gameplay
- [ ] App Open ads on launch

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

## P2 - Future Tasks
- [ ] Real payment processor (Stripe/RevenueCat)
- [ ] Backend for user data persistence
- [ ] Leaderboards
- [ ] Achievements system

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
- **MOCKED:** Ads are mocked for Expo Go compatibility
- **MOCKED:** In-app purchases are not implemented
- Real ads require `react-native-google-mobile-ads` which needs a development build (not compatible with Expo Go)

---
Last Updated: December 2025
