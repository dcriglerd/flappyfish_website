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

    // Fish body
    const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, 25);
    gradient.addColorStop(0, getSkinColor());
    gradient.addColorStop(1, '#CC7700');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.fillStyle = getSkinColor();
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-40, -15);
    ctx.lineTo(-40, 15);
    ctx.closePath();
    ctx.fill();

    // Fin
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(10, -30);
    ctx.lineTo(-10, -15);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(12, -5, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(14, -5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Bubble shield effect
    if (activePowerUp === 'bubble_shield') {
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }, [getSkinColor, activePowerUp]);

  const drawObstacle = useCallback((ctx, obstacle) => {
    const gradient = ctx.createLinearGradient(obstacle.x, 0, obstacle.x + 60, 0);
    gradient.addColorStop(0, '#2E8B57');
    gradient.addColorStop(0.5, '#3CB371');
    gradient.addColorStop(1, '#2E8B57');

    ctx.fillStyle = gradient;

    // Top coral/seaweed
    ctx.beginPath();
    ctx.roundRect(obstacle.x, 0, 60, obstacle.gapY - GAME_CONFIG.gapHeight / 2, [0, 0, 10, 10]);
    ctx.fill();

    // Bottom coral/seaweed
    ctx.beginPath();
    ctx.roundRect(
      obstacle.x, 
      obstacle.gapY + GAME_CONFIG.gapHeight / 2, 
      60, 
      600 - (obstacle.gapY + GAME_CONFIG.gapHeight / 2),
      [10, 10, 0, 0]
    );
    ctx.fill();

    // Decorative bubbles on obstacles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(obstacle.x + 30 + Math.sin(Date.now() / 200 + i) * 10, obstacle.gapY - 100 + i * 30, 5, 0, Math.PI * 2);
      ctx.fill();
    }
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

    // Sky gradient (night sky effect)
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#1a1a4e');
    skyGradient.addColorStop(0.4, '#2d3a8c');
    skyGradient.addColorStop(0.7, '#4a6fa5');
    skyGradient.addColorStop(1, '#6bb3d9');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars (very slow parallax - almost static)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 30; i++) {
      const starX = ((i * 73 + 50) % canvas.width + offset * 0.02) % canvas.width;
      const starY = (i * 37 + 20) % (canvas.height * 0.5);
      const starSize = 1 + (i % 3);
      ctx.beginPath();
      ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Moon (slowest parallax)
    const moonX = ((canvas.width * 0.75) - offset * 0.03) % (canvas.width + 150) + 75;
    ctx.fillStyle = '#e8e8f0';
    ctx.beginPath();
    ctx.arc(moonX, 80, 50, 0, Math.PI * 2);
    ctx.fill();
    // Moon craters
    ctx.fillStyle = 'rgba(180, 200, 210, 0.4)';
    ctx.beginPath();
    ctx.arc(moonX - 15, 70, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 20, 90, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX - 5, 100, 6, 0, Math.PI * 2);
    ctx.fill();

    // Hot air balloons (very slow parallax)
    const drawBalloon = (bx, by, size, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(bx, by, size, size * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Basket
      ctx.fillStyle = '#4a3728';
      ctx.fillRect(bx - size * 0.3, by + size * 1.4, size * 0.6, size * 0.4);
      // Ropes
      ctx.strokeStyle = '#4a3728';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx - size * 0.3, by + size * 1.4);
      ctx.lineTo(bx - size * 0.5, by + size);
      ctx.moveTo(bx + size * 0.3, by + size * 1.4);
      ctx.lineTo(bx + size * 0.5, by + size);
      ctx.stroke();
    };
    drawBalloon((600 - offset * 0.05) % (canvas.width + 200), 150, 25, 'rgba(128, 90, 150, 0.7)');
    drawBalloon((350 - offset * 0.04) % (canvas.width + 200), 200, 18, 'rgba(150, 100, 140, 0.6)');

    // Far cityscape silhouette (slow parallax)
    ctx.fillStyle = 'rgba(60, 50, 90, 0.6)';
    const cityBaseY = canvas.height - 180;
    for (let i = 0; i < 15; i++) {
      const buildingX = ((i * 80 - offset * 0.15) % (canvas.width + 200)) - 100;
      const buildingHeight = 60 + Math.sin(i * 1.5) * 40 + (i % 3) * 20;
      const buildingWidth = 30 + (i % 4) * 15;
      ctx.fillRect(buildingX, cityBaseY - buildingHeight, buildingWidth, buildingHeight + 100);
      // Windows
      ctx.fillStyle = 'rgba(255, 255, 150, 0.3)';
      for (let wy = 0; wy < buildingHeight - 10; wy += 15) {
        for (let wx = 5; wx < buildingWidth - 5; wx += 12) {
          if (Math.random() > 0.3) {
            ctx.fillRect(buildingX + wx, cityBaseY - buildingHeight + wy + 5, 6, 8);
          }
        }
      }
      ctx.fillStyle = 'rgba(60, 50, 90, 0.6)';
    }

    // Far clouds layer (slow parallax)
    ctx.fillStyle = 'rgba(120, 180, 220, 0.4)';
    for (let i = 0; i < 6; i++) {
      const cloudX = ((i * 200 + 100 - offset * 0.2) % (canvas.width + 300)) - 150;
      const cloudY = 280 + (i % 3) * 40;
      drawCloud(ctx, cloudX, cloudY, 80 + (i % 2) * 30);
    }

    // Mid clouds layer (medium parallax)
    ctx.fillStyle = 'rgba(150, 210, 240, 0.5)';
    for (let i = 0; i < 5; i++) {
      const cloudX = ((i * 220 + 50 - offset * 0.4) % (canvas.width + 350)) - 175;
      const cloudY = 320 + (i % 2) * 60;
      drawCloud(ctx, cloudX, cloudY, 100 + (i % 3) * 20);
    }

    // Near clouds layer (faster parallax)
    ctx.fillStyle = 'rgba(180, 230, 255, 0.6)';
    for (let i = 0; i < 4; i++) {
      const cloudX = ((i * 280 - offset * 0.7) % (canvas.width + 400)) - 200;
      const cloudY = 380 + (i % 2) * 30;
      drawCloud(ctx, cloudX, cloudY, 120 + (i % 2) * 30);
    }

    // Animated bubbles rising
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 15; i++) {
      const bubbleX = ((i * 60 + time * 15) % canvas.width);
      const bubbleY = canvas.height - ((time * 40 + i * 50) % (canvas.height + 100));
      const bubbleSize = 2 + Math.sin(i + time) * 2;
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ground layer with grass (fastest parallax - matches obstacles)
    drawGround(ctx, canvas, offset);
  }, [gameState]);

  // Helper function to draw clouds
  const drawCloud = (ctx, x, y, size) => {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y - size * 0.15, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2);
    ctx.arc(x + size * 0.35, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  };

  // Helper function to draw ground
  const drawGround = (ctx, canvas, offset) => {
    const groundY = canvas.height - 50;
    
    // Grass layer
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    for (let x = 0; x <= canvas.width; x += 15) {
      const grassHeight = 8 + Math.sin((x + offset) / 20) * 5;
      ctx.lineTo(x, groundY - grassHeight);
    }
    ctx.lineTo(canvas.width, groundY);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Stone/brick base layer
    ctx.fillStyle = '#37474F';
    ctx.fillRect(0, groundY + 5, canvas.width, canvas.height - groundY);

    // Brick pattern
    ctx.fillStyle = '#455A64';
    const brickWidth = 40;
    const brickHeight = 15;
    for (let row = 0; row < 3; row++) {
      const rowOffset = row % 2 === 0 ? 0 : brickWidth / 2;
      for (let col = -1; col < canvas.width / brickWidth + 2; col++) {
        const brickX = ((col * brickWidth + rowOffset - offset * 0.5) % (canvas.width + brickWidth * 2)) - brickWidth;
        ctx.strokeStyle = '#263238';
        ctx.lineWidth = 2;
        ctx.strokeRect(brickX, groundY + 8 + row * brickHeight, brickWidth - 2, brickHeight - 2);
      }
    }

    // Grass tufts on top
    ctx.fillStyle = '#66BB6A';
    for (let i = 0; i < 30; i++) {
      const tuftX = ((i * 35 - offset) % (canvas.width + 100)) - 50;
      const tuftY = groundY - 5;
      ctx.beginPath();
      ctx.moveTo(tuftX, tuftY);
      ctx.lineTo(tuftX - 3, tuftY - 12 - Math.sin(i) * 4);
      ctx.lineTo(tuftX + 3, tuftY);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(tuftX + 5, tuftY);
      ctx.lineTo(tuftX + 8, tuftY - 10 - Math.cos(i) * 3);
      ctx.lineTo(tuftX + 11, tuftY);
      ctx.fill();
    }
  };

  const checkCollision = useCallback((fish, obstacle) => {
    const fishLeft = fish.x - 20;
    const fishRight = fish.x + 20;
    const fishTop = fish.y - 15;
    const fishBottom = fish.y + 15;

    const obsLeft = obstacle.x;
    const obsRight = obstacle.x + 60;
    const gapTop = obstacle.gapY - GAME_CONFIG.gapHeight / 2;
    const gapBottom = obstacle.gapY + GAME_CONFIG.gapHeight / 2;

    if (fishRight > obsLeft && fishLeft < obsRight) {
      if (fishTop < gapTop || fishBottom > gapBottom) {
        return true;
      }
    }
    return false;
  }, []);

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

      // Boundary check
      if (game.fish.y < 0 || game.fish.y > canvas.height - 30) {
        if (activePowerUp !== 'bubble_shield') {
          onGameOver();
        } else {
          game.fish.y = Math.max(20, Math.min(canvas.height - 50, game.fish.y));
          game.fish.velocity = 0;
        }
      }

      // Spawn obstacles
      if (timestamp - game.lastObstacleTime > GAME_CONFIG.obstacleInterval) {
        const gapY = 100 + Math.random() * (canvas.height - 250);
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

        game.lastObstacleTime = timestamp;
      }

      // Update obstacles
      game.obstacles = game.obstacles.filter(obs => {
        obs.x -= GAME_CONFIG.obstacleSpeed * speedMultiplier;

        // Score check
        if (!obs.scored && obs.x + 60 < game.fish.x) {
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
