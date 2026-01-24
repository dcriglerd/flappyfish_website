import React from 'react';
import { Shield, Clock, Magnet, Coins, Zap } from 'lucide-react';
import { Button } from '../ui/button';

const iconMap = {
  Shield: Shield,
  Clock: Clock,
  Magnet: Magnet,
  Coins: Coins,
};

const PowerUpSelector = ({ availablePowerUps, onUsePowerUp, gameCoins }) => {
  if (!availablePowerUps || availablePowerUps.length === 0) return null;

  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      {availablePowerUps.map((powerUp, index) => {
        const IconComponent = iconMap[powerUp.icon] || Zap;
        return (
          <Button
            key={`${powerUp.id}-${index}`}
            onClick={() => onUsePowerUp(powerUp)}
            className="w-12 h-12 p-0 bg-purple-500/80 hover:bg-purple-600 rounded-xl relative group transition-all hover:scale-110"
            title={powerUp.name}
          >
            <IconComponent className="w-6 h-6 text-white" />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              <p className="text-white text-sm font-semibold">{powerUp.name}</p>
              <p className="text-white/70 text-xs">{powerUp.description}</p>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default PowerUpSelector;
