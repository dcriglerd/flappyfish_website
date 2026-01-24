import React, { useState } from 'react';
import { X, Check, Lock, Coins, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { FISH_SKINS } from '../../data/mockData';

const SkinsModal = ({ isOpen, onClose, coins, selectedSkin, onSelectSkin, onUnlockSkin, unlockedSkins }) => {
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleUnlock = (skin) => {
    if (coins >= skin.cost) {
      onUnlockSkin(skin);
      setMessage(`${skin.name} unlocked!`);
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage('Not enough coins!');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleSelect = (skin) => {
    if (unlockedSkins.includes(skin.id)) {
      onSelectSkin(skin);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gradient-to-b from-purple-800 to-indigo-900 rounded-3xl w-[90%] max-w-md max-h-[80%] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6" /> FISH SKINS
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-lg px-3 py-1 flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-200" />
              <span className="font-bold text-white">{coins}</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mx-4 mt-3 bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2 text-green-300 text-center font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> {message}
          </div>
        )}

        {/* Skins Grid */}
        <div className="p-4 overflow-y-auto max-h-[400px]">
          <div className="grid grid-cols-2 gap-4">
            {FISH_SKINS.map((skin) => {
              const isUnlocked = unlockedSkins.includes(skin.id);
              const isSelected = selectedSkin?.id === skin.id;

              return (
                <div
                  key={skin.id}
                  className={`relative bg-white/10 rounded-xl p-4 text-center cursor-pointer transition-all hover:scale-105 ${
                    isSelected ? 'ring-2 ring-yellow-400' : ''
                  }`}
                  onClick={() => handleSelect(skin)}
                >
                  {/* Fish Preview */}
                  <div className="w-20 h-20 mx-auto mb-3 relative">
                    <svg viewBox="0 0 100 80" className="w-full h-full">
                      <ellipse
                        cx="50"
                        cy="40"
                        rx="35"
                        ry="25"
                        fill={skin.color === 'rainbow' ? 'url(#rainbow)' : skin.color}
                      />
                      <polygon
                        points="15,40 -5,20 -5,60"
                        fill={skin.color === 'rainbow' ? 'url(#rainbow)' : skin.color}
                      />
                      <circle cx="65" cy="35" r="8" fill="white" />
                      <circle cx="67" cy="35" r="4" fill="black" />
                      {skin.color === 'rainbow' && (
                        <defs>
                          <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff0000" />
                            <stop offset="25%" stopColor="#ffff00" />
                            <stop offset="50%" stopColor="#00ff00" />
                            <stop offset="75%" stopColor="#0000ff" />
                            <stop offset="100%" stopColor="#ff00ff" />
                          </linearGradient>
                        </defs>
                      )}
                    </svg>
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white/60" />
                      </div>
                    )}
                    {isSelected && isUnlocked && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Skin Info */}
                  <h3 className="text-white font-bold mb-1">{skin.name}</h3>
                  
                  {isUnlocked ? (
                    <span className="text-green-400 text-sm">Owned</span>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnlock(skin);
                      }}
                      size="sm"
                      className={`text-sm ${
                        coins >= skin.cost
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white'
                          : 'bg-gray-500 text-gray-300'
                      }`}
                    >
                      <Coins className="w-3 h-3 mr-1" /> {skin.cost}
                    </Button>
                  )}
                </div>
              );
            })}  
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinsModal;
