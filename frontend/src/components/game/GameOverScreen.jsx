import React from 'react';
import { RotateCcw, Home, Film, Share2, Trophy, Coins } from 'lucide-react';
import { Button } from '../ui/button';

// GameOverPanel with RetryButton and ScoreText
const GameOverScreen = ({
  score,
  highScore,
  coins,
  isNewHighScore,
  canRevive,
  onRetry,      // Renamed from onRestart to match Unity hierarchy
  onRevive,
  onHome,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-40">
      {/* Game Over Title */}
      <div className="mb-4 text-center">
        {isNewHighScore ? (
          <>
            <h2 className="text-4xl md:text-5xl font-black text-yellow-400 mb-2 animate-bounce">
              🌟 NEW RECORD! 🌟
            </h2>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                  ⭐
                </span>
              ))}
            </div>
          </>
        ) : (
          <h2 className="text-4xl md:text-5xl font-black text-red-400 mb-2">
            GAME OVER
          </h2>
        )}
      </div>

      {/* Score Card / ScoreText */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-4 min-w-[250px] md:min-w-[280px]">
        <div className="flex flex-col items-center gap-3">
          {/* Score */}
          <div className="text-center">
            <p className="text-white/70 text-xs uppercase tracking-wide">Score</p>
            <p className="text-4xl md:text-5xl font-black text-white">{score}</p>
          </div>

          <div className="w-full h-px bg-white/20" />

          {/* Stats */}
          <div className="flex justify-around w-full">
            <div className="text-center">
              <div className="flex items-center gap-1 text-yellow-400">
                <Trophy className="w-4 h-4" />
                <span className="text-xs">Best</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white">{highScore}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-yellow-400">
                <Coins className="w-4 h-4" />
                <span className="text-xs">Coins</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white">{coins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revive Option (Watch Ad) */}
      {canRevive && (
        <div className="mb-3">
          <Button
            onClick={onRevive}
            className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all animate-pulse"
          >
            <Film className="w-5 h-5 mr-2" />
            Watch Ad to Revive
          </Button>
          <p className="text-center text-white/50 text-xs mt-1">Continue from where you left off!</p>
        </div>
      )}

      {/* RetryButton and Home Button */}
      <div className="flex gap-3">
        {/* RETRY BUTTON - Main action */}
        <Button
          onClick={onRetry}
          className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all border-2 border-orange-600"
          style={{ boxShadow: '0 4px 0 #c2410c' }}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          RETRY
        </Button>
        <Button
          onClick={onHome}
          variant="secondary"
          className="h-12 md:h-14 px-5 md:px-6 font-semibold bg-white/20 hover:bg-white/30 text-white rounded-xl border border-white/30"
        >
          <Home className="w-5 h-5 mr-1" />
          Menu
        </Button>
      </div>

      {/* Share */}
      <button className="mt-4 flex items-center gap-2 text-white/60 hover:text-white transition-colors">
        <Share2 className="w-4 h-4" />
        <span className="text-sm">Share Score</span>
      </button>
    </div>
  );
};

export default GameOverScreen;
