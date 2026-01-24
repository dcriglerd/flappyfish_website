import React, { useRef, useEffect, useCallback } from 'react';
import { GAME_CONFIG } from '../../data/mockData';

const GameCanvas = ({ 
  gameState, 
  gameRef, 
  onFlap, 
  onScoreUpdate, 
  onCoinCollect,
  onGameOver,
  onTriggerChase,
  isChasing,
  activePowerUp,
  selectedSkin
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  const getSkinColor = useCallback(() => {
    if (selectedSkin?.color === 'rainbow') {
      const time = Date.now() / 100;
      const r = Math.sin(time) * 127 + 128;
      const g = Math.sin(time + 2) * 127 + 128;
      const b = Math.sin(time + 4) * 127 + 128;
      return `rgb(${r}, ${g}, ${b})`;
    }
    return selectedSkin?.color || '#FFD700';
  }, [selectedSkin]);

  const drawFish = useCallback((ctx, fish) => {
    ctx.save();
    ctx.translate(fish.x, fish.y);
    ctx.rotate(fish.rotation * Math.PI / 180);

    const baseColor = getSkinColor();
    const darkerColor = selectedSkin?.color === 'rainbow' ? '#CC7700' : shadeColor(baseColor, -30);

    // 2D Flat Fish Style - Main body (oval)
    ctx.fillStyle = baseColor;
    ctx.strokeStyle = darkerColor;
    ctx.lineWidth = 3;
    
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 28, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tail fin (triangle)
    ctx.fillStyle = darkerColor;
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-42, -18);
    ctx.lineTo(-42, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Top fin
    ctx.fillStyle = darkerColor;
    ctx.beginPath();
    ctx.moveTo(-5, -18);
    ctx.lineTo(5, -32);
    ctx.lineTo(15, -18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bottom fin
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(8, 28);
    ctx.lineTo(15, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Belly stripe (lighter)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(5, 8, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye white (large, cartoon style)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(12, -3, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pupil (black)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(15, -3, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(13, -6, 2, 0, Math.PI * 2);
    ctx.fill();

    // Lips/mouth
    ctx.strokeStyle = darkerColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(26, 5, 5, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Bubble shield effect
    if (activePowerUp === 'bubble_shield') {
      ctx.strokeStyle = 'rgba(100, 220, 255, 0.7)';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, [getSkinColor, activePowerUp, selectedSkin]);

  // Helper to darken/lighten colors
  const shadeColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const drawObstacle = useCallback((ctx, obstacle) => {
    const pipeWidth = 70;
    const capHeight = 20;
    const capWidth = 80;
    const topPipeHeight = obstacle.gapY - GAME_CONFIG.gapHeight / 2;
    const bottomPipeY = obstacle.gapY + GAME_CONFIG.gapHeight / 2;
    const bottomPipeHeight = 600 - bottomPipeY;

    // Coral/seaweed pillar gradient (underwater colors)
    const pipeGradient = ctx.createLinearGradient(obstacle.x, 0, obstacle.x + pipeWidth, 0);
    pipeGradient.addColorStop(0, '#1a5a4a');
    pipeGradient.addColorStop(0.3, '#2d8a6e');
    pipeGradient.addColorStop(0.5, '#3cb371');
    pipeGradient.addColorStop(0.7, '#2d8a6e');
    pipeGradient.addColorStop(1, '#1a5a4a');

    // Cap gradient (coral top)
    const capGradient = ctx.createLinearGradient(obstacle.x - 5, 0, obstacle.x + capWidth - 5, 0);
    capGradient.addColorStop(0, '#145040');
    capGradient.addColorStop(0.3, '#1a6b5a');
    capGradient.addColorStop(0.5, '#2d8a6e');
    capGradient.addColorStop(0.7, '#1a6b5a');
    capGradient.addColorStop(1, '#145040');

    // TOP PILLAR
    ctx.fillStyle = pipeGradient;
    ctx.fillRect(obstacle.x, 0, pipeWidth, topPipeHeight - capHeight);

    // Top cap
    ctx.fillStyle = capGradient;
    ctx.beginPath();
    ctx.roundRect(obstacle.x - 5, topPipeHeight - capHeight, capWidth, capHeight, [0, 0, 8, 8]);
    ctx.fill();

    // Coral details on top pipe
    ctx.fillStyle = 'rgba(100, 200, 150, 0.3)';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(obstacle.x + 15 + i * 20, topPipeHeight - capHeight - 10 - i * 15, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // BOTTOM PILLAR
    ctx.fillStyle = pipeGradient;
    ctx.fillRect(obstacle.x, bottomPipeY + capHeight, pipeWidth, bottomPipeHeight - capHeight);

    // Bottom cap
    ctx.fillStyle = capGradient;
    ctx.beginPath();
    ctx.roundRect(obstacle.x - 5, bottomPipeY, capWidth, capHeight, [8, 8, 0, 0]);
    ctx.fill();

    // Barnacles/coral bumps
    ctx.fillStyle = '#4a8068';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(
        obstacle.x + 10 + (i % 2) * 50,
        bottomPipeY + capHeight + 30 + i * 40,
        6 + (i % 2) * 3,
        0, Math.PI * 2
      );
      ctx.fill();
    }

    // Subtle highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(obstacle.x + 5, 0, 15, topPipeHeight - capHeight);
    ctx.fillRect(obstacle.x + 5, bottomPipeY + capHeight, 15, bottomPipeHeight - capHeight);

    // Outline
    ctx.strokeStyle = '#0d3d30';
    ctx.lineWidth = 2;
    ctx.strokeRect(obstacle.x, 0, pipeWidth, topPipeHeight - capHeight);
    ctx.strokeRect(obstacle.x - 5, topPipeHeight - capHeight, capWidth, capHeight);
    ctx.strokeRect(obstacle.x, bottomPipeY + capHeight, pipeWidth, bottomPipeHeight - capHeight);
    ctx.strokeRect(obstacle.x - 5, bottomPipeY, capWidth, capHeight);
  }, []);


  const drawEnemy = useCallback((ctx, enemy) => {
    if (!enemy) return;

    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.type === 'shark') {
      // Shark body
      ctx.fillStyle = '#708090';
      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dorsal fin
      ctx.beginPath();
      ctx.moveTo(-10, -20);
      ctx.lineTo(0, -45);
      ctx.lineTo(20, -20);
      ctx.closePath();
      ctx.fill();

      // Tail
      ctx.beginPath();
      ctx.moveTo(-45, 0);
      ctx.lineTo(-70, -25);
      ctx.lineTo(-70, 25);
      ctx.closePath();
      ctx.fill();

      // Teeth
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(45 + i * 4, -3);
        ctx.lineTo(47 + i * 4, 5);
        ctx.lineTo(49 + i * 4, -3);
        ctx.fill();
      }

      // Eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(30, -10, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Octopus body
      ctx.fillStyle = '#E75480';
      ctx.beginPath();
      ctx.ellipse(0, -10, 35, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tentacles
      for (let i = 0; i < 6; i++) {
        const angle = (i - 2.5) * 0.4;
        const wave = Math.sin(Date.now() / 100 + i) * 10;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 20, 15);
        ctx.quadraticCurveTo(
          Math.cos(angle) * 30 + wave, 40,
          Math.cos(angle) * 25, 60
        );
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#E75480';
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-12, -15, 10, 0, Math.PI * 2);
      ctx.arc(12, -15, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(-10, -15, 5, 0, Math.PI * 2);
      ctx.arc(14, -15, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }, []);

  const drawCoin = useCallback((ctx, coin) => {
    ctx.save();
    ctx.translate(coin.x, coin.y);
    
    const scale = Math.abs(Math.sin(Date.now() / 200));
    ctx.scale(scale * 0.5 + 0.5, 1);

    const gradient = ctx.createRadialGradient(0, 0, 2, 0, 0, 15);
    gradient.addColorStop(0, '#FFE566');
    gradient.addColorStop(1, '#FFD700');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#DAA520';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 0);

    ctx.restore();
  }, []);

  // Parallax offset tracking
  const parallaxRef = useRef({ offset: 0 });

  const drawBackground = useCallback((ctx, canvas) => {
    const time = Date.now() / 1000;
    
    // Update parallax offset when playing
    if (gameState === 'playing') {
      parallaxRef.current.offset += 2;
    }
    const offset = parallaxRef.current.offset;

    // BRIGHT ocean gradient
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGradient.addColorStop(0, '#00d4ff');
    oceanGradient.addColorStop(0.25, '#00b4d8');
    oceanGradient.addColorStop(0.5, '#0096c7');
    oceanGradient.addColorStop(0.75, '#0077b6');
    oceanGradient.addColorStop(1, '#005f8a');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Brighter light rays from surface
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < 8; i++) {
      const rayX = ((i * 120 + 30 - offset * 0.02) % (canvas.width + 200)) - 100;
      ctx.beginPath();
      ctx.moveTo(rayX, 0);
      ctx.lineTo(rayX - 30, canvas.height);
      ctx.lineTo(rayX + 70, canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    // Far background coral/rocks
    ctx.fillStyle = 'rgba(0, 80, 120, 0.4)';
    for (let i = 0; i < 8; i++) {
      const rockX = ((i * 130 - offset * 0.1) % (canvas.width + 200)) - 100;
      const rockHeight = 80 + Math.sin(i * 2) * 40;
      drawRock(ctx, rockX, canvas.height - 55, rockHeight, 50 + (i % 3) * 15);
    }

    // Mid-ground seaweed
    for (let i = 0; i < 12; i++) {
      const seaweedX = ((i * 80 - offset * 0.3) % (canvas.width + 150)) - 75;
      drawSeaweed(ctx, seaweedX, canvas.height - 45, 60 + (i % 4) * 20, time, i);
    }

    // Distant fish swimming
    for (let i = 0; i < 6; i++) {
      const fishX = ((i * 180 + offset * 0.15 + 100) % (canvas.width + 300)) - 150;
      const fishY = 80 + (i % 3) * 70 + Math.sin(time + i) * 15;
      drawSmallFish(ctx, fishX, fishY, 12 + (i % 2) * 5, 'rgba(100, 180, 220, 0.5)');
    }

    // LOTS of rising bubbles - bright and visible
    for (let i = 0; i < 40; i++) {
      const bubbleX = ((i * 28 + offset * 0.15) % canvas.width);
      const bubbleY = canvas.height - ((time * 45 + i * 25) % (canvas.height + 80));
      const bubbleSize = 3 + Math.sin(i + time * 1.5) * 3;
      
      // Bubble body with gradient effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Bubble outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Bubble shine/highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(bubbleX - bubbleSize * 0.3, bubbleY - bubbleSize * 0.3, bubbleSize * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    // Foreground coral reef
    drawCoralReef(ctx, canvas, offset, time);

    // Sandy ocean floor
    drawOceanFloor(ctx, canvas, offset);
  }, [gameState]);

  // Helper: Draw underwater rock formation
  const drawRock = (ctx, x, baseY, height, width) => {
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x + width * 0.2, baseY - height * 0.7, x + width * 0.5, baseY - height);
    ctx.quadraticCurveTo(x + width * 0.8, baseY - height * 0.6, x + width, baseY);
    ctx.closePath();
    ctx.fill();
  };

  // Helper: Draw seaweed (brighter green)
  const drawSeaweed = (ctx, x, baseY, height, time, index) => {
    const sway = Math.sin(time * 1.5 + index) * 10;
    
    // Main stalk - bright green
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x + sway, baseY - height * 0.5, x + sway * 1.5, baseY - height);
    ctx.stroke();

    // Side fronds - even brighter
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 5;
    for (let j = 0; j < 3; j++) {
      const frondY = baseY - height * (0.3 + j * 0.25);
      const frondSway = sway * (0.5 + j * 0.2);
      ctx.beginPath();
      ctx.moveTo(x + frondSway * 0.5, frondY);
      ctx.quadraticCurveTo(x + frondSway + 15, frondY - 15, x + frondSway + 25, frondY - 10);
      ctx.stroke();
    }
  };

  // Helper: Draw small background fish
  const drawSmallFish = (ctx, x, y, size, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x - size * 1.5, y - size * 0.5);
    ctx.lineTo(x - size * 1.5, y + size * 0.5);
    ctx.closePath();
    ctx.fill();
  };

  // Helper: Draw coral reef at bottom
  const drawCoralReef = (ctx, canvas, offset, time) => {
    const colors = ['#ff6b6b', '#ffa07a', '#ff69b4', '#dda0dd', '#ff7f50'];
    
    for (let i = 0; i < 10; i++) {
      const coralX = ((i * 100 - offset * 0.5) % (canvas.width + 150)) - 75;
      const color = colors[i % colors.length];
      
      // Branch coral
      if (i % 2 === 0) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        const baseY = canvas.height - 45;
        for (let b = 0; b < 4; b++) {
          const angle = -60 + b * 40;
          const len = 25 + (b % 2) * 15;
          ctx.beginPath();
          ctx.moveTo(coralX, baseY);
          ctx.lineTo(
            coralX + Math.cos(angle * Math.PI / 180) * len,
            baseY + Math.sin(angle * Math.PI / 180) * len
          );
          ctx.stroke();
        }
      } else {
        // Round coral
        ctx.fillStyle = color;
        for (let c = 0; c < 5; c++) {
          ctx.beginPath();
          ctx.arc(
            coralX + c * 8 - 16,
            canvas.height - 50 - c * 3 + Math.abs(c - 2) * 5,
            8 + Math.sin(c) * 3,
            0, Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  };

  // Helper: Draw ocean floor
  const drawOceanFloor = (ctx, canvas, offset) => {
    // Sandy gradient
    const sandGradient = ctx.createLinearGradient(0, canvas.height - 40, 0, canvas.height);
    sandGradient.addColorStop(0, '#c4a35a');
    sandGradient.addColorStop(0.5, '#b8956f');
    sandGradient.addColorStop(1, '#9c7e5a');
    
    ctx.fillStyle = sandGradient;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 35);
    // Wavy sand
    for (let x = 0; x <= canvas.width; x += 20) {
      const waveY = canvas.height - 35 + Math.sin((x + offset) / 30) * 5;
      ctx.lineTo(x, waveY);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Sand ripples
    ctx.strokeStyle = 'rgba(150, 120, 80, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const rippleX = ((i * 120 - offset * 0.8) % (canvas.width + 100)) - 50;
      ctx.beginPath();
      ctx.arc(rippleX, canvas.height - 20, 30 + i * 5, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
    }

    // Small shells/pebbles
    ctx.fillStyle = 'rgba(180, 160, 140, 0.6)';
    for (let i = 0; i < 15; i++) {
      const pebbleX = ((i * 60 - offset * 0.6) % (canvas.width + 50)) - 25;
      ctx.beginPath();
      ctx.ellipse(pebbleX, canvas.height - 15 + (i % 3) * 5, 4 + (i % 3) * 2, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const checkCollision = useCallback((fish, obstacle) => {
    const fishLeft = fish.x - 20;
    const fishRight = fish.x + 20;
    const fishTop = fish.y - 15;
    const fishBottom = fish.y + 15;

    const obsLeft = obstacle.x;
    const obsRight = obstacle.x + 70; // Updated for wider pipe
    const gapTop = obstacle.gapY - GAME_CONFIG.gapHeight / 2;
    const gapBottom = obstacle.gapY + GAME_CONFIG.gapHeight / 2;

    if (fishRight > obsLeft && fishLeft < obsRight) {
      if (fishTop < gapTop || fishBottom > gapBottom) {
        return true;
      }
    }
    return false;
  }, []);

  // Reset parallax when game state changes to menu
  useEffect(() => {
    if (gameState === 'menu') {
      parallaxRef.current.offset = 0;
    }
  }, [gameState]);

  const gameLoop = useCallback((timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Clear and draw background
    drawBackground(ctx, canvas);

    if (gameState === 'playing') {
      const speedMultiplier = activePowerUp === 'slow_motion' ? 0.5 : 1;

      // Update fish
      game.fish.velocity += GAME_CONFIG.gravity * speedMultiplier;
      game.fish.y += game.fish.velocity;
      game.fish.rotation = Math.min(90, Math.max(-30, game.fish.velocity * 3));

      // Boundary check - ceiling and ocean floor
      if (game.fish.y < 5 || game.fish.y > canvas.height - 55) {
        if (activePowerUp !== 'bubble_shield') {
          onGameOver();
        } else {
          game.fish.y = Math.max(10, Math.min(canvas.height - 60, game.fish.y));
          game.fish.velocity = 0;
        }
      }

      // Spawn obstacles using performance.now() based timing
      const currentTime = performance.now();
      if (!game.lastObstacleTime || currentTime - game.lastObstacleTime > GAME_CONFIG.obstacleInterval) {
        if (game.lastObstacleTime) { // Skip first spawn to give player breathing room
          // Ensure gap is in playable area (not too close to ground)
          const gapY = 130 + Math.random() * (canvas.height - 320);
          game.obstacles.push({
            x: canvas.width,
            gapY,
            scored: false,
          });

          // Spawn coin in gap
          if (Math.random() < 0.7) {
            game.collectibles.push({
              x: canvas.width + 30,
              y: gapY,
              type: 'coin',
            });
          }

          // Random chase trigger
          if (Math.random() < GAME_CONFIG.chaseChance) {
            onTriggerChase();
          }
        }

        game.lastObstacleTime = currentTime;
      }

      // Update obstacles
      game.obstacles = game.obstacles.filter(obs => {
        obs.x -= GAME_CONFIG.obstacleSpeed * speedMultiplier;

        // Score check
        if (!obs.scored && obs.x + 70 < game.fish.x) {
          obs.scored = true;
          onScoreUpdate(prev => prev + 1);
        }

        // Collision check
        if (checkCollision(game.fish, obs)) {
          if (activePowerUp !== 'bubble_shield') {
            onGameOver();
          }
        }

        return obs.x > -70;
      });

      // Update collectibles
      game.collectibles = game.collectibles.filter(col => {
        col.x -= GAME_CONFIG.obstacleSpeed * speedMultiplier;

        // Magnet effect
        if (activePowerUp === 'magnet') {
          const dx = game.fish.x - col.x;
          const dy = game.fish.y - col.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            col.x += dx * 0.1;
            col.y += dy * 0.1;
          }
        }

        // Collision with fish
        const dx = game.fish.x - col.x;
        const dy = game.fish.y - col.y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          onCoinCollect(1);
          return false;
        }

        return col.x > -20;
      });

      // Update enemy
      if (game.enemy) {
        const targetY = game.fish.y;
        game.enemy.x += game.enemy.speed * speedMultiplier;
        game.enemy.y += (targetY - game.enemy.y) * 0.02;

        // Check enemy collision
        const dx = game.fish.x - game.enemy.x;
        const dy = game.fish.y - game.enemy.y;
        if (Math.sqrt(dx * dx + dy * dy) < 50) {
          if (activePowerUp !== 'bubble_shield') {
            onGameOver();
          }
        }
      }
    }

    // Draw game elements
    game.obstacles.forEach(obs => drawObstacle(ctx, obs));
    game.collectibles.forEach(col => drawCoin(ctx, col));
    if (game.enemy && isChasing) {
      drawEnemy(ctx, game.enemy);
    }
    drawFish(ctx, game.fish);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, gameRef, drawBackground, drawFish, drawObstacle, drawCoin, drawEnemy, checkCollision, onScoreUpdate, onCoinCollect, onGameOver, onTriggerChase, isChasing, activePowerUp]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  const handleInteraction = useCallback((e) => {
    e.preventDefault();
    onFlap();
  }, [onFlap]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      className="rounded-2xl shadow-2xl cursor-pointer max-w-full"
      style={{ touchAction: 'none' }}
    />
  );
};

export default GameCanvas;
