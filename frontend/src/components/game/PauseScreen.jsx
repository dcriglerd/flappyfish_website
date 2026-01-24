import React from 'react';
import { Play, Home, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

const PauseScreen = ({ onResume, onRestart, onHome, isMuted, onToggleMute }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center">
        <h2 className="text-4xl font-black text-white mb-6">PAUSED</h2>
        
        <div className="flex flex-col gap-3 w-56">
          <Button
            onClick={onResume}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            <Play className="w-6 h-6 mr-2" />
            Resume
          </Button>
          
          <Button
            onClick={onRestart}
            variant="secondary"
            className="w-full h-12 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Restart
          </Button>
          
          <Button
            onClick={onToggleMute}
            variant="secondary"
            className="w-full h-12 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold"
          >
            {isMuted ? (
              <><VolumeX className="w-5 h-5 mr-2" /> Unmute</>
            ) : (
              <><Volume2 className="w-5 h-5 mr-2" /> Mute</>
            )}
          </Button>
          
          <Button
            onClick={onHome}
            variant="secondary"
            className="w-full h-12 bg-red-500/80 hover:bg-red-500 text-white rounded-xl font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Quit to Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;
