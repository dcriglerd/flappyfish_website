import React from 'react';
import { X } from 'lucide-react';

// Banner Ad Component (Bottom of screen)
export const BannerAd = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div 
        className="w-full max-w-[320px] h-[50px] bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center border-t border-gray-600"
        style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-xs font-bold text-black">
            AD
          </div>
          <div className="text-white text-sm">
            <span className="text-yellow-400 font-semibold">Flappy Fish Pro</span>
            <span className="text-gray-300 text-xs ml-2">Remove Ads</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interstitial Ad Component (Full screen overlay)
export const InterstitialAd = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
      <div className="relative w-full max-w-[350px] mx-4">
        {/* Close button - appears after 3 seconds */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Ad Content */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700">
          {/* Ad Header */}
          <div className="bg-yellow-500 px-4 py-2 flex items-center justify-between">
            <span className="text-black font-bold text-sm">ADVERTISEMENT</span>
            <span className="text-black/70 text-xs">Sponsored</span>
          </div>

          {/* Ad Image Area */}
          <div className="h-[200px] bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center relative overflow-hidden">
            {/* Decorative bubbles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: `${15 + Math.random() * 25}px`,
                  height: `${15 + Math.random() * 25}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
            
            {/* Mock ad content */}
            <div className="text-center z-10">
              <div className="text-6xl mb-2">🐠</div>
              <h3 className="text-white text-xl font-bold">Flappy Fish Pro</h3>
              <p className="text-cyan-200 text-sm">Ad-free experience!</p>
            </div>
          </div>

          {/* Ad Footer */}
          <div className="p-4 text-center">
            <p className="text-gray-400 text-xs mb-3">
              Support the game by watching this ad
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              Continue Playing
            </button>
          </div>
        </div>

        {/* Skip timer indicator */}
        <p className="text-center text-gray-500 text-xs mt-3">
          Tap X or button to close
        </p>
      </div>
    </div>
  );
};

export default { BannerAd, InterstitialAd };
