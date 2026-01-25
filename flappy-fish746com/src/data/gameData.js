// Game data for Flappy Fish Mobile

export const POWER_UPS = [
  {
    id: 'bubble_shield',
    name: 'Bubble Shield',
    description: 'Protects from one hit',
    cost: 50,
    icon: '🛡️',
    duration: 10000,
  },
  {
    id: 'slow_motion',
    name: 'Slow Motion',
    description: 'Slows obstacles for 5s',
    cost: 75,
    icon: '⏱️',
    duration: 5000,
  },
  {
    id: 'magnet',
    name: 'Coin Magnet',
    description: 'Attracts nearby coins',
    cost: 100,
    icon: '🧲',
    duration: 8000,
  },
  {
    id: 'double_coins',
    name: 'Double Coins',
    description: '2x coins for 30s',
    cost: 150,
    icon: '💰',
    duration: 30000,
  },
];

export const SHOP_ITEMS = [
  {
    id: 'coins_100',
    name: '100 Coins',
    price: '$0.99',
    coins: 100,
    type: 'coins',
    popular: false,
  },
  {
    id: 'coins_500',
    name: '500 Coins',
    price: '$3.99',
    coins: 500,
    type: 'coins',
    popular: true,
    bonus: '+50 Bonus',
  },
  {
    id: 'coins_1000',
    name: '1000 Coins',
    price: '$6.99',
    coins: 1000,
    type: 'coins',
    popular: false,
    bonus: '+200 Bonus',
  },
  {
    id: 'remove_ads',
    name: 'Remove Ads',
    price: '$2.99',
    type: 'premium',
    description: 'Play without interruptions',
  },
];

export const FISH_SKINS = [
  {
    id: 'default',
    name: 'Goldie',
    color: '#FFD700',
    cost: 0,
  },
  {
    id: 'clownfish',
    name: 'Nemo',
    color: '#FF6B35',
    cost: 100,
  },
  {
    id: 'bluefish',
    name: 'Azure',
    color: '#00CED1',
    cost: 200,
  },
  {
    id: 'purplefish',
    name: 'Mystic',
    color: '#9B59B6',
    cost: 300,
  },
  {
    id: 'rainbow',
    name: 'Prisma',
    color: 'rainbow',
    cost: 500,
  },
  {
    id: 'greenfish',
    name: 'Emerald',
    color: '#2ECC71',
    cost: 250,
  },
];
