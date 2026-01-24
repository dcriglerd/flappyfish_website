import React, { useState } from 'react';
import { X, Coins, Zap, Crown, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { SHOP_ITEMS, POWER_UPS } from '../../data/mockData';

const ShopModal = ({ isOpen, onClose, coins, onPurchase, onBuyPowerUp }) => {
  const [activeTab, setActiveTab] = useState('coins');
  const [purchaseMessage, setPurchaseMessage] = useState(null);

  if (!isOpen) return null;

  const handlePurchase = (item) => {
    // Simulate purchase
    setPurchaseMessage(`Purchased ${item.name}!`);
    setTimeout(() => setPurchaseMessage(null), 2000);
    if (item.type === 'coins') {
      onPurchase(item.coins + (parseInt(item.bonus?.replace(/[^0-9]/g, '')) || 0));
    }
  };

  const handleBuyPowerUp = (powerUp) => {
    if (coins >= powerUp.cost) {
      onBuyPowerUp(powerUp);
      setPurchaseMessage(`${powerUp.name} ready to use!`);
      setTimeout(() => setPurchaseMessage(null), 2000);
    } else {
      setPurchaseMessage('Not enough coins!');
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gradient-to-b from-cyan-800 to-blue-900 rounded-3xl w-[90%] max-w-md max-h-[80%] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Crown className="w-6 h-6" /> SHOP
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

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('coins')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'coins'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4 inline mr-1" /> Coins
          </button>
          <button
            onClick={() => setActiveTab('powerups')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'powerups'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-1" /> Power-ups
          </button>
        </div>

        {/* Purchase Message */}
        {purchaseMessage && (
          <div className="mx-4 mt-3 bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2 text-green-300 text-center font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> {purchaseMessage}
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[400px]">
          {activeTab === 'coins' && (
            <div className="grid gap-3">
              {SHOP_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className={`relative bg-white/10 rounded-xl p-4 flex items-center justify-between ${
                    item.popular ? 'ring-2 ring-yellow-400' : ''
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-2 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      POPULAR
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-lg">{item.name}</h3>
                    {item.bonus && (
                      <span className="text-green-400 text-sm">{item.bonus}</span>
                    )}
                    {item.description && (
                      <p className="text-white/60 text-sm">{item.description}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => handlePurchase(item)}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold rounded-lg px-4"
                  >
                    {item.price}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'powerups' && (
            <div className="grid gap-3">
              {POWER_UPS.map((powerUp) => (
                <div
                  key={powerUp.id}
                  className="bg-white/10 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/30 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{powerUp.name}</h3>
                    <p className="text-white/60 text-sm">{powerUp.description}</p>
                  </div>
                  <Button
                    onClick={() => handleBuyPowerUp(powerUp)}
                    disabled={coins < powerUp.cost}
                    className={`font-bold rounded-lg px-4 ${
                      coins >= powerUp.cost
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <Coins className="w-4 h-4 mr-1" /> {powerUp.cost}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopModal;
