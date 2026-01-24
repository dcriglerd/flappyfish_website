# Flappy Fish Mobile - React Native

A React Native mobile game with **real Google Mobile Ads SDK** integration.

## Game Hierarchy

```
├── Main Camera (View container)
├── Canvas
│   ├── Background
│   ├── Player (Fish)
│   ├── Spawner (Obstacles)
│   ├── GameOverPanel
│   │   └── RetryButton
│   └── ScoreText (GameUI)
└── AdsManager
    ├── BannerAd (bottom of screen)
    ├── InterstitialAd (every 3 deaths)
    └── RewardedAd (revive feature)
```

## Prerequisites

1. **Node.js** 18+ and **npm** or **yarn**
2. **Expo CLI**: `npm install -g expo-cli`
3. **EAS CLI** (for building): `npm install -g eas-cli`
4. **Android Studio** (for Android) or **Xcode** (for iOS)
5. **Google AdMob Account**: https://admob.google.com

## Setup Instructions

### 1. Install Dependencies

```bash
cd /app/mobile
npm install
# or
yarn install
```

### 2. Configure AdMob IDs

Edit `app.json` and replace the test App IDs with your production IDs:

```json
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
      "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
    }
  ]
]
```

Then edit `src/constants/config.js` and add your Ad Unit IDs:

```javascript
PRODUCTION_IDS: {
  BANNER: {
    ANDROID: 'ca-app-pub-XXXXX/XXXXX',
    IOS: 'ca-app-pub-XXXXX/XXXXX',
  },
  INTERSTITIAL: {
    ANDROID: 'ca-app-pub-XXXXX/XXXXX',
    IOS: 'ca-app-pub-XXXXX/XXXXX',
  },
  REWARDED: {
    ANDROID: 'ca-app-pub-XXXXX/XXXXX',
    IOS: 'ca-app-pub-XXXXX/XXXXX',
  },
},

// Set to false for production
USE_TEST_IDS: false,
```

### 3. Run the App

**Development (Expo Go - Limited ads support)**:
```bash
npx expo start
```

**Development Build (Full ads support)**:
```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

### 4. Build for Production

```bash
# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

## Google Mobile Ads Integration

### Ad Types Implemented

| Ad Type | Trigger | File |
|---------|---------|------|
| Banner | Menu & Game Over screens | `BannerAdComponent.js` |
| Interstitial | Every 3 deaths | `AdsContext.js` |
| Rewarded | "Watch Ad to Revive" button | `AdsContext.js` |

### Test Ad IDs (Already configured)

- **Banner Android**: `ca-app-pub-3940256099942544/6300978111`
- **Banner iOS**: `ca-app-pub-3940256099942544/2934735716`
- **Interstitial Android**: `ca-app-pub-3940256099942544/1033173712`
- **Interstitial iOS**: `ca-app-pub-3940256099942544/4411468910`
- **Rewarded Android**: `ca-app-pub-3940256099942544/5224354917`
- **Rewarded iOS**: `ca-app-pub-3940256099942544/1712485313`

## iOS App Tracking Transparency (ATT)

The app includes ATT permission request for iOS 14+. The permission description is configured in `app.json`:

```json
"infoPlist": {
  "NSUserTrackingUsageDescription": "This identifier will be used to deliver personalized ads to you."
}
```

## Project Structure

```
/app/mobile/
├── App.js                 # Entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── src/
│   ├── components/
│   │   ├── Background.js
│   │   ├── BannerAdComponent.js
│   │   ├── Coin.js
│   │   ├── Fish.js
│   │   ├── GameCanvas.js
│   │   ├── GameOverScreen.js
│   │   ├── GameUI.js
│   │   ├── Obstacle.js
│   │   └── StartScreen.js
│   ├── constants/
│   │   └── config.js      # Game & Ad configuration
│   ├── context/
│   │   ├── AdsContext.js  # Google Mobile Ads Manager
│   │   └── GameContext.js # Game state management
│   └── screens/
│       └── FlappyFishGame.js
└── assets/
    ├── icon.png
    ├── splash.png
    └── adaptive-icon.png
```

## Troubleshooting

### Ads not showing
1. Make sure you're using a development build, not Expo Go
2. Check that AdMob IDs are correct
3. Enable test mode for development

### iOS build fails
1. Run `cd ios && pod install`
2. Make sure SKAdNetwork IDs are configured

### Android build fails
1. Check that `AD_ID` permission is added
2. Verify minSdkVersion is 21+

## License

MIT License - Feel free to use and modify!
