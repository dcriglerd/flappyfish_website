import React from 'react';
import { Pause, Play, Volume2, VolumeX, Coins, Trophy, Zap } from 'lucide-react';
import { Button } from '../ui/button';

const GameUI = ({
  score,
  highScore,
  coins,
  gameState,
  isChasing,
  chaseEnemy,
  activePowerUp,
  onPause,
  onResume,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Score */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2">
          <div className="flex items-center gap-2 text-white">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-2xl font-bold">{score}</span>
          </div>
          <div className="text-xs text-white/70">Best: {highScore}</div>
        </div>

        {/* Coins */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2">
          <div className="flex items-center gap-2 text-white">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-bold">{coins}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white rounded-xl"
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          {gameState === 'playing' && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white rounded-xl"
              onClick={onPause}
            >
              <Pause className="w-5 h-5" />
            </Button>
          )}
          {gameState === 'paused' && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white rounded-xl"
              onClick={onResume}
            >
              <Play className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Chase Warning */}
      {isChasing && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 animate-pulse">
          <div className="bg-red-500/90 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-3">
            <Zap className="w-6 h-6 text-white animate-bounce" />
            <span className="text-white font-bold text-lg uppercase tracking-wide">
              {chaseEnemy === 'shark' ? '🦈 Shark Attack!' : '🐙 Octopus Chasing!'}
            </span>
            <Zap className="w-6 h-6 text-white animate-bounce" />
          </div>
        </div>
      )}

      {/* Active Power-up */}
      {activePowerUp && (
        <div className="absolute bottom-4 left-4">
          <div className="bg-purple-500/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white font-semibold capitalize">
              {activePowerUp.replace('_', ' ')} Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
