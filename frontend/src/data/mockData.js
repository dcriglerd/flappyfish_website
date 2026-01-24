// Mock data for Flappy Fish game

export const GAME_CONFIG = {
  gravity: 0.25,          // Reduced from 0.35 - fish falls slower
  flapForce: -6,          // Reduced from -7.5 - gentler, more controlled flaps
  obstacleSpeed: 2,       // Reduced from 2.5 - obstacles move slower
  obstacleInterval: 2200, // Increased from 2000 - more time between obstacles
  gapHeight: 190,         // Increased from 175 - larger gaps to swim through
  fishSize: 40,
  chaseChance: 0.10,      // Reduced from 0.12 - less frequent chases
  chaseDuration: 8000,    // ms
};

export const POWER_UPS = [
  {
    id: 'bubble_shield',
    name: 'Bubble Shield',
    description: 'Protects from one hit',
    cost: 50,
    icon: 'Shield',
    duration: 10000,
  },
  {
    id: 'slow_motion',
    name: 'Slow Motion',
    description: 'Slows obstacles for 5s',
    cost: 75,
    icon: 'Clock',
    duration: 5000,
  },
  {
    id: 'magnet',
    name: 'Coin Magnet',
    description: 'Attracts nearby coins',
    cost: 100,
    icon: 'Magnet',
    duration: 8000,
  },
  {
    id: 'double_coins',
    name: 'Double Coins',
    description: '2x coins for 30s',
    cost: 150,
    icon: 'Coins',
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
    unlocked: true,
  },
  {
    id: 'clownfish',
    name: 'Nemo',
    color: '#FF6B35',
    cost: 100,
    unlocked: false,
  },
  {
    id: 'bluefish',
    name: 'Azure',
    color: '#00CED1',
    cost: 200,
    unlocked: false,
  },
  {
    id: 'purplefish',
    name: 'Mystic',
    color: '#9B59B6',
    cost: 300,
    unlocked: false,
  },
  {
    id: 'rainbow',
    name: 'Prisma',
    color: 'rainbow',
    cost: 500,
    unlocked: false,
  },
];

export const ACHIEVEMENTS = [
  { id: 'first_flight', name: 'First Swim', description: 'Play your first game', reward: 10 },
  { id: 'score_10', name: 'Getting Started', description: 'Score 10 points', reward: 25 },
  { id: 'score_50', name: 'Pro Swimmer', description: 'Score 50 points', reward: 50 },
  { id: 'score_100', name: 'Ocean Master', description: 'Score 100 points', reward: 100 },
  { id: 'survive_chase', name: 'Great Escape', description: 'Survive a shark chase', reward: 30 },
  { id: 'collect_100', name: 'Treasure Hunter', description: 'Collect 100 coins total', reward: 50 },
];

export const ENEMIES = {
  shark: {
    name: 'Shark',
    speed: 1.8,
    size: 80,
    color: '#708090',
  },
  octopus: {
    name: 'Octopus',
    speed: 1.5,
    size: 70,
    color: '#E75480',
  },
};
