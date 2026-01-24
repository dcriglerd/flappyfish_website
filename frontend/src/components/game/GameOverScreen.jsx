import React from 'react';
import { RefreshCw, Home, Film, Share2, Trophy, Coins } from 'lucide-react';
import { Button } from '../ui/button';

const GameOverScreen = ({
  score,
  highScore,
  coins,
  isNewHighScore,
  canRevive,
  onRestart,
  onRevive,
  onHome,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Game Over Title */}
      <div className="mb-6 text-center">
        {isNewHighScore ? (
          <>
            <h2 className="text-5xl font-black text-yellow-400 mb-2 animate-bounce">
              🌟 NEW RECORD! 🌟
            </h2>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                  ⭐
                </span>
              ))}
            </div>
          </>
        ) : (
          <h2 className="text-5xl font-black text-red-400 mb-2">
            GAME OVER
          </h2>
        )}
      </div>

      {/* Score Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 min-w-[280px]">
        <div className="flex flex-col items-center gap-4">
          {/* Score */}
          <div className="text-center">
            <p className="text-white/70 text-sm uppercase tracking-wide">Score</p>
            <p className="text-5xl font-black text-white">{score}</p>
          </div>

          <div className="w-full h-px bg-white/20" />

          {/* Stats */}
          <div className="flex justify-around w-full">
            <div className="text-center">
              <div className="flex items-center gap-1 text-yellow-400">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">Best</span>
              </div>
              <p className="text-xl font-bold text-white">{highScore}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-yellow-400">
                <Coins className="w-4 h-4" />
                <span className="text-sm">Coins</span>
              </div>
              <p className="text-xl font-bold text-white">{coins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revive Option */}
      {canRevive && (
        <div className="mb-4">
          <Button
            onClick={onRevive}
            className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all animate-pulse"
          >
            <Film className="w-5 h-5 mr-2" />
            Watch Ad to Revive
          </Button>
          <p className="text-center text-white/50 text-xs mt-2">Continue from where you left off!</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onRestart}
          className="h-12 px-6 font-semibold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Play Again
        </Button>
        <Button
          onClick={onHome}
          variant="secondary"
          className="h-12 px-6 font-semibold bg-white/20 hover:bg-white/30 text-white rounded-xl"
        >
          <Home className="w-5 h-5 mr-2" />
          Menu
        </Button>
      </div>

      {/* Share */}
      <button className="mt-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors">
        <Share2 className="w-4 h-4" />
        <span className="text-sm">Share Score</span>
      </button>
    </div>
  );
};

export default GameOverScreen;
