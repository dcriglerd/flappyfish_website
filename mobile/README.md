# 🐠 Flappy Fish Mobile

A fun underwater Flappy Bird clone built with React Native and Expo, featuring **real Google AdMob integration**!

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **EAS CLI** installed: `npm install -g eas-cli`
- **Expo account**: Sign up at [expo.dev](https://expo.dev)
- For iOS builds: Mac with Xcode installed
- For Android builds: Android Studio (optional for local builds)

### Building the App

This app uses **Expo Development Builds** with native Google Mobile Ads SDK.

#### 1. Login to Expo
```bash
eas login
```

#### 2. Configure your project (first time only)
```bash
cd /app/mobile
eas build:configure
```

#### 3. Build for Android
```bash
# Development build (for testing with dev tools)
eas build --platform android --profile development

# Preview build (standalone APK for testing)
eas build --platform android --profile preview

# Production build (for Play Store)
eas build --platform android --profile production
```

#### 4. Build for iOS
```bash
# Development build (simulator)
eas build --platform ios --profile development

# Production build (for App Store)
eas build --platform ios --profile production
```

#### 5. Install and Run
After the build completes:
- Download the APK/IPA from the Expo dashboard
- Install on your device
- Start the dev server: `npx expo start --dev-client`

## 📢 Google AdMob Integration

This app includes **real Google AdMob** integration with:
- ✅ **Banner Ads** - Shown at bottom of menu screens
- ✅ **Interstitial Ads** - Shown every 3 game overs
- ✅ **Rewarded Ads** - Watch to revive after death

### Test Ads (Default)
The app is configured to use **Google's test ad unit IDs** by default. These show test advertisements that are safe for development.

### Production Ads
To use your own AdMob ads:

1. Create an [AdMob account](https://admob.google.com)
2. Register your app and create ad units
3. Update `app.json` with your **App IDs**:
   ```json
   "react-native-google-mobile-ads": {
     "android_app_id": "ca-app-pub-YOUR_APP_ID",
     "ios_app_id": "ca-app-pub-YOUR_APP_ID"
   }
   ```
4. Update `src/constants/config.js` with your **Ad Unit IDs**
5. Set `USE_TEST_IDS: false` in config.js
6. Rebuild the app

## 🎮 How to Play

- **Tap** anywhere to make the fish swim upward
- Avoid the coral reef obstacles
- Collect coins to increase your score
- Watch ads to revive after death!

## 🎯 Features

- ✅ Smooth 60fps gameplay
- ✅ Haptic feedback
- ✅ Sound effects (flap, coin, score, game over)
- ✅ Animated underwater background
- ✅ High score tracking (saved locally)
- ✅ Coin collection system
- ✅ Real Google AdMob integration
- ✅ Mute toggle

## 📁 Project Structure

```
mobile/
├── App.js                    # Entry point + Ads SDK init
├── app.json                  # Expo config + AdMob App IDs
├── eas.json                  # EAS Build configuration
├── assets/
│   └── sounds/               # Game audio files
├── src/
│   ├── components/
│   │   ├── Background.js     # Animated underwater scene
│   │   ├── Fish.js           # SVG fish character  
│   │   ├── Obstacle.js       # Coral reef pipes
│   │   ├── Coin.js           # Collectible coins
│   │   ├── GameCanvas.js     # Main game loop
│   │   ├── GameUI.js         # HUD (score, pause, mute)
│   │   ├── StartScreen.js    # Main menu
│   │   ├── GameOverScreen.js # End game modal
│   │   └── BannerAdComponent.js  # Google AdMob banner
│   ├── context/
│   │   ├── GameContext.js    # Game state
│   │   ├── AdsContext.js     # AdMob management
│   │   └── AudioContext.js   # Sound effects
│   ├── hooks/
│   │   └── useGameAudio.js   # Audio playback
│   ├── constants/
│   │   └── config.js         # Game + Ad config
│   └── screens/
│       └── FlappyFishGame.js # Main screen
└── package.json
```

## 🔧 Configuration

### Game Settings (`src/constants/config.js`)
- `GRAVITY` - How fast the fish falls
- `FLAP_FORCE` - How high each tap makes the fish swim
- `OBSTACLE_SPEED` - How fast obstacles move
- `GAP_HEIGHT` - Size of the gap between obstacles
- `INTERSTITIAL_FREQUENCY` - Show interstitial every N deaths

### Ad Settings
- `USE_TEST_IDS` - Use test ads (true) or production (false)
- `PRODUCTION_IDS` - Your AdMob ad unit IDs

## 🛠️ Troubleshooting

### Ads not showing?
1. Ensure you're using a **development build** (not Expo Go)
2. Check console logs for ad loading errors
3. Verify your AdMob account is active
4. New ad units may take a few hours to serve ads

### Build failing?
1. Clear cache: `npx expo prebuild --clean`
2. Delete node_modules: `rm -rf node_modules && yarn install`
3. Check EAS build logs for specific errors

---

Made with 💙 using Expo + React Native + Google AdMob
