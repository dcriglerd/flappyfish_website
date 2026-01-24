import React, { useEffect, useState } from 'react';
import { Play, Trophy, ShoppingCart, Award } from 'lucide-react';
import { Button } from '../ui/button';

const StartScreen = ({ onStart, onOpenShop, onOpenSkins, highScore, coins }) => {
  const [bubbles, setBubbles] = useState([]);

  // Generate floating bubbles
  useEffect(() => {
    const newBubbles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 6 + Math.random() * 18,
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 4,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start pt-4 md:pt-8 overflow-hidden">
      {/* Bright underwater gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #00d4ff 0%, #00b4d8 25%, #0096c7 50%, #0077b6 75%, #023e8a 100%)'
        }}
      />

      {/* Animated light rays from surface */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute top-0 opacity-15"
            style={{
              left: `${8 + i * 15}%`,
              width: '50px',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)',
              transform: `rotate(${-6 + i * 2}deg)`,
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>

      {/* Floating bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full animate-bubble-rise"
          style={{
            left: `${bubble.x}%`,
            bottom: '-30px',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.25))',
            border: '1.5px solid rgba(255,255,255,0.5)',
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}

      {/* Seaweed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-24 pointer-events-none z-10">
        {[...Array(14)].map((_, i) => (
          <div
            key={`weed-${i}`}
            className="absolute bottom-0 animate-seaweed-sway"
            style={{
              left: `${i * 7.5}%`,
              animationDelay: `${i * 0.12}s`,
            }}
          >
            <svg width="28" height="70" viewBox="0 0 28 70">
              <path
                d={`M14,70 Q${6 + Math.random() * 6},45 14,30 Q${18 + Math.random() * 6},15 ${10 + Math.random() * 6},0`}
                stroke="#22c55e"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M14,70 Q${18 + Math.random() * 6},42 18,28 Q${10 + Math.random() * 6},12 ${14 + Math.random() * 6},2`}
                stroke="#4ade80"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Sandy bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-6 md:h-8 z-0"
        style={{
          background: 'linear-gradient(180deg, #f4d03f 0%, #d4a84b 50%, #b8956f 100%)',
          borderTop: '2px solid #c9a227'
        }}
      />

      {/* Main Content Container - Scrollable on small screens */}
      <div className="relative z-20 flex flex-col items-center w-full px-4 pb-20">
        
        {/* Game Title with 2D Fish */}
        <div className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {/* Animated 2D Fish mascot */}
            <div className="animate-fish-bob flex-shrink-0">
              <svg width="50" height="38" viewBox="0 0 80 60" className="md:w-[70px] md:h-[52px]">
                {/* Fish body */}
                <ellipse cx="40" cy="30" rx="30" ry="20" fill="#FFD700" stroke="#CC9900" strokeWidth="3"/>
                {/* Tail */}
                <polygon points="10,30 -8,14 -8,46" fill="#FFA500" stroke="#CC7700" strokeWidth="2"/>
                {/* Top fin */}
                <polygon points="35,10 44,-6 52,10" fill="#FFA500" stroke="#CC7700" strokeWidth="2"/>
                {/* Belly */}
                <ellipse cx="46" cy="36" rx="16" ry="9" fill="rgba(255,255,255,0.4)"/>
                {/* Eye white */}
                <circle cx="55" cy="25" r="10" fill="white" stroke="#333" strokeWidth="2"/>
                {/* Pupil */}
                <circle cx="58" cy="25" r="5" fill="black"/>
                {/* Eye shine */}
                <circle cx="56" cy="22" r="2.5" fill="white"/>
              </svg>
            </div>

            {/* Title */}
            <div className="flex flex-col">
              <h1 
                className="text-3xl md:text-5xl font-black tracking-tight leading-none"
                style={{
                  color: '#FFFFFF',
                  textShadow: '3px 3px 0 #0077b6, -1px -1px 0 #00b4d8, 1px -1px 0 #0077b6, -1px 1px 0 #00b4d8',
                }}
              >
                FLAPPY
              </h1>
              <h1 
                className="text-3xl md:text-5xl font-black tracking-tight leading-none -mt-1"
                style={{
                  color: '#FFD700',
                  textShadow: '3px 3px 0 #CC7700, -1px -1px 0 #FFA500, 1px -1px 0 #CC7700, -1px 1px 0 #FFA500',
                }}
              >
                FISH
              </h1>
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex gap-3 mb-4 md:mb-6">
          <div className="bg-white/25 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-white/40 shadow-lg">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="text-white/80 text-xs font-semibold">Best</span>
            </div>
            <p className="text-2xl md:text-3xl font-black text-white text-center drop-shadow-lg">{highScore}</p>
          </div>
          <div className="bg-white/25 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-yellow-400/50 shadow-lg">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🪙</span>
              <span className="text-white/80 text-xs font-semibold">Coins</span>
            </div>
            <p className="text-2xl md:text-3xl font-black text-yellow-300 text-center drop-shadow-lg">{coins}</p>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="flex flex-col gap-2.5 w-full max-w-[260px] md:max-w-[280px]">
          <Button
            onClick={onStart}
            className="w-full h-14 md:h-16 text-xl md:text-2xl font-black rounded-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all border-4 border-orange-700 text-white"
            style={{
              background: 'linear-gradient(180deg, #ff9f43 0%, #ff6b35 50%, #ee5a24 100%)',
              boxShadow: '0 5px 0 #c44d1a, 0 6px 12px rgba(0,0,0,0.25)'
            }}
          >
            <Play className="w-6 h-6 md:w-7 md:h-7 mr-2" fill="white" />
            START
          </Button>
          
          <div className="flex gap-2.5">
            <Button
              onClick={onOpenShop}
              className="flex-1 h-12 md:h-14 text-base md:text-lg font-bold rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all border-2 border-green-700 text-white"
              style={{
                background: 'linear-gradient(180deg, #2ecc71 0%, #27ae60 50%, #1e8449 100%)',
                boxShadow: '0 4px 0 #196f3d'
              }}
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              Shop
            </Button>
            <Button
              onClick={onOpenSkins}
              className="flex-1 h-12 md:h-14 text-base md:text-lg font-bold rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all border-2 border-purple-700 text-white"
              style={{
                background: 'linear-gradient(180deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)',
                boxShadow: '0 4px 0 #5b21b6'
              }}
            >
              <Award className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              Skins
            </Button>
          </div>
        </div>

        {/* Tap instruction */}
        <div className="mt-4 md:mt-6 text-center">
          <p className="text-white/90 text-sm md:text-base font-semibold animate-pulse drop-shadow-lg">
            🫧 Tap to swim! 🫧
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% { opacity: 0.7; }
          90% { opacity: 0.4; }
          100% {
            transform: translateY(-100vh) scale(0.4);
            opacity: 0;
          }
        }
        .animate-bubble-rise {
          animation: bubble-rise ease-in-out infinite;
        }
        @keyframes seaweed-sway {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        .animate-seaweed-sway {
          animation: seaweed-sway 2s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes fish-bob {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
        .animate-fish-bob {
          animation: fish-bob 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StartScreen;
