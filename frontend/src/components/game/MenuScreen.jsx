import React from 'react';
import { Play, ShoppingCart, Award, Settings, Info } from 'lucide-react';
import { Button } from '../ui/button';

const MenuScreen = ({ onStartGame, onOpenShop, onOpenSkins, highScore, coins }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-cyan-600/90 to-blue-800/90 backdrop-blur-sm">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-6xl font-black text-white mb-2 drop-shadow-lg" style={{ textShadow: '4px 4px 0 #0077B6' }}>
          🐠 FLAPPY FISH
        </h1>
        <p className="text-cyan-200 text-lg">Swim, dodge, survive!</p>
      </div>

      {/* Animated Fish */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 animate-bounce" style={{ animationDuration: '1s' }}>
          <svg viewBox="0 0 100 80" className="w-full h-full">
            {/* Fish body */}
            <ellipse cx="50" cy="40" rx="35" ry="25" fill="#FFD700" />
            {/* Tail */}
            <polygon points="15,40 -5,20 -5,60" fill="#FFD700" />
            {/* Fin */}
            <polygon points="50,15 60,0 40,15" fill="#FFA500" />
            {/* Eye */}
            <circle cx="65" cy="35" r="8" fill="white" />
            <circle cx="67" cy="35" r="4" fill="black" />
            {/* Scales pattern */}
            <circle cx="40" cy="40" r="8" fill="#FFA500" opacity="0.3" />
            <circle cx="55" cy="45" r="6" fill="#FFA500" opacity="0.3" />
          </svg>
        </div>
        {/* Bubbles */}
        <div className="absolute -right-4 top-1/2 flex flex-col gap-2">
          <div className="w-3 h-3 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="w-4 h-4 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-8">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
          <p className="text-white/70 text-sm">Best Score</p>
          <p className="text-white text-2xl font-bold">{highScore}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
          <p className="text-white/70 text-sm">Coins</p>
          <p className="text-yellow-300 text-2xl font-bold">💰 {coins}</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="flex flex-col gap-3 w-64">
        <Button
          onClick={onStartGame}
          className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all"
        >
          <Play className="w-6 h-6 mr-2" />
          PLAY
        </Button>
        
        <div className="flex gap-3">
          <Button
            onClick={onOpenShop}
            variant="secondary"
            className="flex-1 h-12 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-xl font-semibold"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Shop
          </Button>
          <Button
            onClick={onOpenSkins}
            variant="secondary"
            className="flex-1 h-12 bg-purple-400 hover:bg-purple-500 text-white rounded-xl font-semibold"
          >
            <Award className="w-5 h-5 mr-2" />
            Skins
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 flex items-center gap-4 text-white/60 text-sm">
        <button className="flex items-center gap-1 hover:text-white transition-colors">
          <Settings className="w-4 h-4" /> Settings
        </button>
        <span>•</span>
        <button className="flex items-center gap-1 hover:text-white transition-colors">
          <Info className="w-4 h-4" /> How to Play
        </button>
      </div>
    </div>
  );
};

export default MenuScreen;
