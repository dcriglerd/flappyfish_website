# 🐠 Flappy Fish Mobile

A fun underwater Flappy Bird clone built with React Native and Expo!

## 🚀 Quick Start (Expo Go)

### Prerequisites
- Install **Expo Go** app on your phone:
  - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

### Run the Game

1. **Navigate to the mobile folder:**
   ```bash
   cd /app/mobile
   ```

2. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

3. **Scan the QR code** with:
   - **Android:** Expo Go app's QR scanner
   - **iOS:** Camera app (will open Expo Go)

4. **Play!** Tap the screen to make the fish swim!

## 🎮 How to Play

- **Tap** anywhere on the screen to make the fish swim upward
- Avoid the coral reef obstacles
- Collect coins to increase your score
- Try to beat your high score!

## 🎯 Features

- ✅ Smooth 60fps gameplay
- ✅ Haptic feedback on tap
- ✅ Animated underwater background with bubbles
- ✅ High score tracking (saved locally)
- ✅ Coin collection system
- ✅ Watch ad to revive (mocked for Expo Go)
- ✅ Beautiful 2D fish character with SVG graphics

## 📱 Tested With

- Expo SDK 50
- React Native 0.73.6
- Expo Go app

## 🔧 Project Structure

```
mobile/
├── App.js                    # Entry point
├── src/
│   ├── components/
│   │   ├── Background.js     # Animated underwater background
│   │   ├── Fish.js           # SVG fish character
│   │   ├── Obstacle.js       # Coral reef obstacles
│   │   ├── Coin.js           # Collectible coins
│   │   ├── GameCanvas.js     # Main game loop & rendering
│   │   ├── GameUI.js         # Score display & pause
│   │   ├── StartScreen.js    # Main menu
│   │   ├── GameOverScreen.js # Game over modal
│   │   └── BannerAdComponent.js  # Mocked ads
│   ├── context/
│   │   ├── GameContext.js    # Game state management
│   │   └── AdsContext.js     # Mocked ads provider
│   ├── constants/
│   │   └── config.js         # Game configuration
│   └── screens/
│       └── FlappyFishGame.js # Main game screen
├── assets/                   # App icons & splash
└── package.json
```

## 🎨 Game Configuration

Edit `src/constants/config.js` to adjust:
- `GRAVITY` - How fast the fish falls
- `FLAP_FORCE` - How high each tap makes the fish swim
- `OBSTACLE_SPEED` - How fast obstacles move
- `GAP_HEIGHT` - Size of the gap between obstacles

## 📢 Ads (Production)

The current build uses **mocked ads** for Expo Go compatibility.

For real Google AdMob integration in production builds:
1. Create an [AdMob account](https://admob.google.com/)
2. Get your Ad Unit IDs
3. Create a development build with `react-native-google-mobile-ads`
4. Update `src/constants/config.js` with your Ad Unit IDs

## 🛠️ Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android

# Build for iOS  
eas build --platform ios
```

---

Made with 💙 by Emergent Labs
