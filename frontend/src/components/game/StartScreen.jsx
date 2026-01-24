import React from 'react';
import { Play, Trophy, ShoppingCart, Award } from 'lucide-react';
import { Button } from '../ui/button';

const StartScreen = ({ onStart, onOpenShop, onOpenSkins, highScore, coins }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Underwater animated background */}
      <div className="absolute inset-0">
        {/* Deep ocean gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0a2a4a 0%, #0d3d5c 30%, #0f4c6d 60%, #1a5f7a 100%)'
          }}
        />
        
        {/* Light rays from surface */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute opacity-10"
            style={{
              top: 0,
              left: `${15 + i * 18}%`,
              width: '80px',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 70%)',
              transform: `rotate(${-5 + i * 3}deg)`,
              transformOrigin: 'top center',
            }}
          />
        ))}

        {/* Floating bubbles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-white/20 animate-float-up"
            style={{
              width: `${8 + Math.random() * 15}px`,
              height: `${8 + Math.random() * 15}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-20px`,
              animationDuration: `${4 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Seaweed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32">
          {[...Array(15)].map((_, i) => (
            <div
              key={`weed-${i}`}
              className="absolute bottom-0 animate-sway"
              style={{
                left: `${i * 7}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <svg width="40" height="100" viewBox="0 0 40 100">
                <path
                  d={`M20,100 Q${10 + Math.random() * 10},70 20,50 Q${25 + Math.random() * 10},30 ${15 + Math.random() * 10},0`}
                  stroke="#1a6b4a"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M20,100 Q${25 + Math.random() * 10},60 25,40 Q${15 + Math.random() * 10},20 ${20 + Math.random() * 10},5`}
                  stroke="#2d8a5e"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Sandy bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{
            background: 'linear-gradient(180deg, #8b7355 0%, #6d5a45 100%)'
          }}
        />
      </div>

      {/* Game Title */}
      <div className="relative z-10 text-center mb-8">
        {/* Fish mascot swimming around title */}
        <div className="relative inline-block">
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 animate-swim">
            <svg width="60" height="45" viewBox="0 0 60 45">
              {/* Fish body */}
              <ellipse cx="30" cy="22" rx="22" ry="15" fill="#FFD700" />
              {/* Tail */}
              <polygon points="8,22 -8,8 -8,36" fill="#FFA500" />
              {/* Fin */}
              <polygon points="30,7 40,-3 22,7" fill="#FFA500" />
              {/* Eye */}
              <circle cx="42" cy="18" r="6" fill="white" />
              <circle cx="44" cy="18" r="3" fill="black" />
              {/* Scales */}
              <circle cx="25" cy="22" r="5" fill="#FFB700" opacity="0.5" />
              <circle cx="35" cy="26" r="4" fill="#FFB700" opacity="0.5" />
            </svg>
          </div>
          
          <h1 
            className="text-6xl md:text-7xl font-black text-transparent bg-clip-text px-8"
            style={{
              backgroundImage: 'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)',
              textShadow: '4px 4px 0 #0c4a6e, -2px -2px 0 #0c4a6e, 2px -2px 0 #0c4a6e, -2px 2px 0 #0c4a6e',
              WebkitTextStroke: '3px #0c4a6e',
            }}
          >
            FLAPPY
          </h1>
          <h1 
            className="text-6xl md:text-7xl font-black text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(180deg, #fde047 0%, #facc15 50%, #eab308 100%)',
              textShadow: '4px 4px 0 #854d0e, -2px -2px 0 #854d0e, 2px -2px 0 #854d0e, -2px 2px 0 #854d0e',
              WebkitTextStroke: '3px #854d0e',
            }}
          >
            FISH
          </h1>
        </div>
        
        {/* Bubbles coming from title */}
        <div className="absolute -right-8 top-0 flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-white/30 animate-ping"
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: '2s' }}
            />
          ))}
        </div>
      </div>

      {/* Stats Display */}
      <div className="relative z-10 flex gap-4 mb-8">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-3 border-2 border-cyan-400/30">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white/70 text-sm">Best</span>
          </div>
          <p className="text-3xl font-black text-white text-center">{highScore}</p>
        </div>
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-3 border-2 border-yellow-400/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <span className="text-white/70 text-sm">Coins</span>
          </div>
          <p className="text-3xl font-black text-yellow-300 text-center">{coins}</p>
        </div>
      </div>

      {/* Main Buttons */}
      <div className="relative z-10 flex flex-col gap-3 w-64">
        <Button
          onClick={onStart}
          className="w-full h-16 text-2xl font-black rounded-2xl shadow-lg transform hover:scale-105 transition-all border-4 border-orange-600"
          style={{
            background: 'linear-gradient(180deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
          }}
        >
          <Play className="w-7 h-7 mr-2" fill="white" />
          START
        </Button>
        
        <div className="flex gap-3">
          <Button
            onClick={onOpenShop}
            className="flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all border-3 border-emerald-600"
            style={{
              background: 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%)',
            }}
          >
            <ShoppingCart className="w-5 h-5 mr-1" />
            Shop
          </Button>
          <Button
            onClick={onOpenSkins}
            className="flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all border-3 border-purple-600"
            style={{
              background: 'linear-gradient(180deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)',
            }}
          >
            <Award className="w-5 h-5 mr-1" />
            Skins
          </Button>
        </div>
      </div>

      {/* Tap instruction */}
      <div className="relative z-10 mt-8 text-cyan-300/70 text-center">
        <p className="text-sm animate-pulse">Tap to swim!</p>
        <p className="text-xs mt-1 text-cyan-400/50">Avoid obstacles and predators</p>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(-100vh) scale(0.3);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up linear infinite;
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes swim {
          0%, 100% { transform: translateX(0) translateY(-50%) rotate(0deg); }
          25% { transform: translateX(5px) translateY(-45%) rotate(5deg); }
          75% { transform: translateX(-5px) translateY(-55%) rotate(-5deg); }
        }
        .animate-swim {
          animation: swim 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StartScreen;
