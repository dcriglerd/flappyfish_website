import React, { useEffect, useState } from 'react';
import { Play, Trophy, ShoppingCart, Award } from 'lucide-react';
import { Button } from '../ui/button';

const StartScreen = ({ onStart, onOpenShop, onOpenSkins, highScore, coins }) => {
  const [bubbles, setBubbles] = useState([]);

  // Generate floating bubbles
  useEffect(() => {
    const newBubbles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 8 + Math.random() * 25,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Bright underwater gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #00d4ff 0%, #00b4d8 25%, #0096c7 50%, #0077b6 75%, #023e8a 100%)'
        }}
      />

      {/* Animated light rays from surface */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute top-0 opacity-20"
            style={{
              left: `${5 + i * 12}%`,
              width: '60px',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 30%, transparent 70%)',
              transform: `rotate(${-8 + i * 2}deg)`,
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
            bottom: '-50px',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
            border: '2px solid rgba(255,255,255,0.5)',
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        >
          {/* Bubble shine */}
          <div 
            className="absolute rounded-full bg-white/80"
            style={{
              width: `${bubble.size * 0.25}px`,
              height: `${bubble.size * 0.25}px`,
              top: '20%',
              left: '25%',
            }}
          />
        </div>
      ))}

      {/* Seaweed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <div
            key={`weed-${i}`}
            className="absolute bottom-0 animate-seaweed-sway"
            style={{
              left: `${i * 6}%`,
              animationDelay: `${i * 0.15}s`,
            }}
          >
            <svg width="35" height="90" viewBox="0 0 35 90">
              <path
                d={`M17,90 Q${8 + Math.random() * 8},60 17,40 Q${22 + Math.random() * 8},20 ${12 + Math.random() * 8},0`}
                stroke="#22c55e"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M17,90 Q${22 + Math.random() * 8},55 22,35 Q${12 + Math.random() * 8},15 ${18 + Math.random() * 8},3`}
                stroke="#4ade80"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Sandy bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-10"
        style={{
          background: 'linear-gradient(180deg, #f4d03f 0%, #d4a84b 50%, #b8956f 100%)',
          borderTop: '3px solid #c9a227'
        }}
      />

      {/* Game Title with 2D Fish */}
      <div className="relative z-10 text-center mb-6">
        <div className="relative inline-flex items-center gap-4">
          {/* Animated 2D Fish mascot */}
          <div className="animate-fish-bob">
            <svg width="80" height="60" viewBox="0 0 80 60">
              {/* Fish body */}
              <ellipse cx="40" cy="30" rx="32" ry="22" fill="#FFD700" stroke="#CC9900" strokeWidth="3"/>
              {/* Tail */}
              <polygon points="8,30 -12,12 -12,48" fill="#FFA500" stroke="#CC7700" strokeWidth="2"/>
              {/* Top fin */}
              <polygon points="35,8 45,-8 55,8" fill="#FFA500" stroke="#CC7700" strokeWidth="2"/>
              {/* Bottom fin */}
              <polygon points="40,50 50,62 58,50" fill="#FFA500" stroke="#CC7700" strokeWidth="2"/>
              {/* Belly */}
              <ellipse cx="48" cy="38" rx="18" ry="10" fill="rgba(255,255,255,0.4)"/>
              {/* Eye white */}
              <circle cx="58" cy="25" r="12" fill="white" stroke="#333" strokeWidth="2"/>
              {/* Pupil */}
              <circle cx="62" cy="25" r="6" fill="black"/>
              {/* Eye shine */}
              <circle cx="59" cy="21" r="3" fill="white"/>
              {/* Mouth */}
              <path d="M72,38 Q78,42 72,46" stroke="#CC7700" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          {/* Title */}
          <div>
            <h1 
              className="text-5xl md:text-6xl font-black tracking-tight"
              style={{
                color: '#FFFFFF',
                textShadow: '4px 4px 0 #0077b6, -2px -2px 0 #00b4d8, 2px -2px 0 #0077b6, -2px 2px 0 #00b4d8, 0 6px 0 #023e8a',
                WebkitTextStroke: '2px #005f8a',
              }}
            >
              FLAPPY
            </h1>
            <h1 
              className="text-5xl md:text-6xl font-black tracking-tight -mt-2"
              style={{
                color: '#FFD700',
                textShadow: '4px 4px 0 #CC7700, -2px -2px 0 #FFA500, 2px -2px 0 #CC7700, -2px 2px 0 #FFA500, 0 6px 0 #8B4513',
                WebkitTextStroke: '2px #996600',
              }}
            >
              FISH
            </h1>
          </div>

          {/* Bubbles near fish */}
          <div className="absolute -right-6 top-0 flex flex-col gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-full bg-white/60 border border-white/80 animate-ping"
                style={{ 
                  width: `${8 + i * 3}px`, 
                  height: `${8 + i * 3}px`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Display */}
      <div className="relative z-10 flex gap-4 mb-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 border-3 border-white/40 shadow-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="text-white/80 text-sm font-semibold">Best</span>
          </div>
          <p className="text-3xl font-black text-white text-center drop-shadow-lg">{highScore}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 border-3 border-yellow-400/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <span className="text-white/80 text-sm font-semibold">Coins</span>
          </div>
          <p className="text-3xl font-black text-yellow-300 text-center drop-shadow-lg">{coins}</p>
        </div>
      </div>

      {/* Main Buttons */}
      <div className="relative z-10 flex flex-col gap-3 w-72">
        <Button
          onClick={onStart}
          className="w-full h-16 text-2xl font-black rounded-2xl shadow-xl transform hover:scale-105 transition-all border-4 border-orange-700 text-white"
          style={{
            background: 'linear-gradient(180deg, #ff9f43 0%, #ff6b35 50%, #ee5a24 100%)',
            boxShadow: '0 6px 0 #c44d1a, 0 8px 15px rgba(0,0,0,0.3)'
          }}
        >
          <Play className="w-8 h-8 mr-2" fill="white" />
          START
        </Button>
        
        <div className="flex gap-3">
          <Button
            onClick={onOpenShop}
            className="flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all border-3 border-green-700 text-white"
            style={{
              background: 'linear-gradient(180deg, #2ecc71 0%, #27ae60 50%, #1e8449 100%)',
              boxShadow: '0 4px 0 #196f3d'
            }}
          >
            <ShoppingCart className="w-5 h-5 mr-1" />
            Shop
          </Button>
          <Button
            onClick={onOpenSkins}
            className="flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all border-3 border-purple-700 text-white"
            style={{
              background: 'linear-gradient(180deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)',
              boxShadow: '0 4px 0 #5b21b6'
            }}
          >
            <Award className="w-5 h-5 mr-1" />
            Skins
          </Button>
        </div>
      </div>

      {/* Tap instruction */}
      <div className="relative z-10 mt-6 text-center">
        <p className="text-white/90 text-lg font-semibold animate-pulse drop-shadow-lg">
          🫧 Tap to swim! 🫧
        </p>
        <p className="text-white/60 text-sm mt-1">Avoid coral and predators</p>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.8; }
          50% { transform: translateY(-50vh) scale(0.9) rotate(180deg); opacity: 0.7; }
          90% { opacity: 0.5; }
          100% {
            transform: translateY(-110vh) scale(0.5) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-bubble-rise {
          animation: bubble-rise ease-in-out infinite;
        }
        @keyframes seaweed-sway {
          0%, 100% { transform: rotate(-8deg) scaleY(1); }
          50% { transform: rotate(8deg) scaleY(1.05); }
        }
        .animate-seaweed-sway {
          animation: seaweed-sway 2.5s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes fish-bob {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .animate-fish-bob {
          animation: fish-bob 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StartScreen;
