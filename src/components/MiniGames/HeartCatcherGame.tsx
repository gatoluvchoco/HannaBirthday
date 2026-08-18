import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Trophy, RefreshCw, X, Sparkles, ChevronLeft, ChevronRight, ShieldAlert, Sliders } from 'lucide-react';

interface HeartCatcherGameProps {
  onBack: () => void;
  onWin: (score?: number) => void;
  highScore?: number;
}

interface FallingItem {
  id: number;
  x: number; // pixel X position
  y: number; // pixel Y position
  speed: number; // pixels per second
  wobble: number;
  type: 'pink' | 'gold' | 'rose' | 'star' | 'glitch';
  icon: string;
  points: number;
}

interface ScorePopup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export const HeartCatcherGame: React.FC<HeartCatcherGameProps> = ({ 
  onBack, 
  onWin, 
  highScore = 0 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game field dimensions
  const GAME_HEIGHT = 380;
  const BASKET_WIDTH = 84;
  const [gameWidth, setGameWidth] = useState(320);
  const gameWidthRef = useRef(320);
  gameWidthRef.current = gameWidth;

  // Basket position in pixels
  const [basketX, setBasketX] = useState(118);
  const basketXRef = useRef(118);
  basketXRef.current = basketX;

  // Velocity for smooth keyboard / hold button physics
  const basketVelocityRef = useRef(0);

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const targetScore = 100;
  const [lives, setLives] = useState(3);
  const livesRef = useRef(3);
  livesRef.current = lives;

  const [gameOver, setGameOver] = useState(false);
  const gameOverRef = useRef(false);
  gameOverRef.current = gameOver;

  const [gameWon, setGameWon] = useState(false);
  const gameWonRef = useRef(false);
  gameWonRef.current = gameWon;

  const [items, setItems] = useState<FallingItem[]>([]);
  const itemsRef = useRef<FallingItem[]>([]);
  itemsRef.current = items;

  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [basketSparkle, setBasketSparkle] = useState(false);

  // Dragging & Input state
  const isDraggingRef = useRef(false);
  const activeHoldDirectionRef = useRef<'left' | 'right' | null>(null);
  const onWinRef = useRef(onWin);
  onWinRef.current = onWin;

  // Responsive width detection
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setGameWidth(width);
          gameWidthRef.current = width;
          setBasketX(prev => Math.min(Math.max(0, width - BASKET_WIDTH), Math.max(0, prev)));
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const addScorePopup = useCallback((x: number, y: number, text: string, color: string) => {
    const newPopup: ScorePopup = {
      id: Date.now() + Math.random(),
      x,
      y: Math.max(20, y - 10),
      text,
      color,
    };
    setPopups(prev => [...prev.slice(-6), newPopup]);

    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== newPopup.id));
    }, 700);
  }, []);

  const handleRestart = () => {
    sound.playClick();
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setGameOver(false);
    gameOverRef.current = false;
    setGameWon(false);
    gameWonRef.current = false;
    setItems([]);
    itemsRef.current = [];
    setPopups([]);
    basketVelocityRef.current = 0;
  };

  // Spawner Loop (Interval)
  useEffect(() => {
    if (gameOver || gameWon) return;

    const spawnTimer = window.setInterval(() => {
      if (gameOverRef.current || gameWonRef.current) return;

      const rand = Math.random();
      let type: FallingItem['type'] = 'pink';
      let icon = '💖';
      let points = 1;

      if (rand < 0.12) {
        type = 'gold';
        icon = '👑';
        points = 5;
      } else if (rand < 0.32) {
        type = 'rose';
        icon = '🌸';
        points = 2;
      } else if (rand < 0.55) {
        type = 'star';
        icon = '✨';
        points = 3;
      } else if (rand < 0.68) {
        type = 'glitch';
        icon = '💣';
        points = -2;
      } else {
        type = 'pink';
        icon = '💖';
        points = 1;
      }

      const currentWidth = containerRef.current?.clientWidth || gameWidthRef.current || 320;
      const xPos = 24 + Math.random() * (Math.max(200, currentWidth) - 48);

      const newItem: FallingItem = {
        id: Date.now() + Math.random(),
        x: xPos,
        y: -24,
        speed: 130 + Math.random() * 110, // Pixels per second (steady, smooth fall)
        wobble: Math.random() * Math.PI * 2,
        type,
        icon,
        points
      };

      setItems(prev => [...prev, newItem]);
    }, 400);

    return () => clearInterval(spawnTimer);
  }, [gameOver, gameWon]);

  // Butter-Smooth 60FPS/120FPS requestAnimationFrame Physics & Movement Engine
  useEffect(() => {
    if (gameOver || gameWon) return;

    let animFrameId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms to prevent jumping
      lastTime = now;

      if (gameOverRef.current || gameWonRef.current) return;

      // Handle continuous smooth hold movement
      if (activeHoldDirectionRef.current === 'left') {
        basketVelocityRef.current = -380; // pixels / sec
      } else if (activeHoldDirectionRef.current === 'right') {
        basketVelocityRef.current = 380;
      } else {
        // Smooth friction deceleration
        basketVelocityRef.current *= 0.82;
        if (Math.abs(basketVelocityRef.current) < 2) basketVelocityRef.current = 0;
      }

      if (basketVelocityRef.current !== 0) {
        setBasketX(prev => {
          const maxBound = Math.max(0, (containerRef.current?.clientWidth || gameWidthRef.current) - BASKET_WIDTH);
          const next = prev + basketVelocityRef.current * dt;
          return Math.max(0, Math.min(maxBound, next));
        });
      }

      // Physics for falling items
      const currentBasketX = basketXRef.current;
      const basketLeft = currentBasketX - 10;
      const basketRight = currentBasketX + BASKET_WIDTH + 10;
      const catchZoneTop = 320;
      const catchZoneBottom = 370;

      const currentItems = itemsRef.current;
      const remainingItems: FallingItem[] = [];

      for (let i = 0; i < currentItems.length; i++) {
        const item = currentItems[i];
        const nextY = item.y + item.speed * dt;

        // Check if item enters the basket catch zone
        if (nextY >= catchZoneTop && nextY <= catchZoneBottom) {
          if (item.x >= basketLeft && item.x <= basketRight) {
            // CAUGHT!
            if (item.type === 'glitch') {
              sound.playPop();
              const nextLives = Math.max(0, livesRef.current - 1);
              setLives(nextLives);
              livesRef.current = nextLives;
              addScorePopup(currentBasketX + BASKET_WIDTH / 2, 330, '-2 💔', '#f87171');
              if (nextLives <= 0) {
                setGameOver(true);
                gameOverRef.current = true;
              }
            } else {
              sound.playHeartCatch();
              setBasketSparkle(true);
              setTimeout(() => setBasketSparkle(false), 200);

              const pointText = item.points > 1 ? `+${item.points} ${item.icon}` : '+1 💖';
              const color = item.type === 'gold' ? '#fbbf24' : item.type === 'rose' ? '#f472b6' : '#fda4af';
              addScorePopup(item.x, item.y, pointText, color);

              const nextScore = scoreRef.current + item.points;
              setScore(nextScore);
              scoreRef.current = nextScore;

              if (nextScore >= targetScore && !gameWonRef.current) {
                setGameWon(true);
                gameWonRef.current = true;
                sound.playLevelUp();
                confetti({
                  particleCount: 100,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ['#f472b6', '#fbbf24', '#ffffff', '#fda4af', '#e879f9']
                });
                setTimeout(() => {
                  onWinRef.current(nextScore);
                }, 10);
              }
            }
            continue; // Remove caught item
          }
        }

        // Keep falling if still on screen
        if (nextY < GAME_HEIGHT + 20) {
          remainingItems.push({ ...item, y: nextY });
        }
      }

      setItems(remainingItems);
      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [gameOver, gameWon, addScorePopup, targetScore]);

  // Keyboard navigation for Desktop / Laptops
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        activeHoldDirectionRef.current = 'left';
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        activeHoldDirectionRef.current = 'right';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') &&
        activeHoldDirectionRef.current === 'left'
      ) {
        activeHoldDirectionRef.current = null;
      } else if (
        (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') &&
        activeHoldDirectionRef.current === 'right'
      ) {
        activeHoldDirectionRef.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Direct Screen Pointer Dragging (Mobile Touch & Mouse)
  const updateBasketFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left - BASKET_WIDTH / 2;
    const maxBound = Math.max(0, (containerRef.current.clientWidth || gameWidthRef.current) - BASKET_WIDTH);
    const clamped = Math.max(0, Math.min(maxBound, relativeX));
    setBasketX(clamped);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    sound.resumeContext();
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
    updateBasketFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateBasketFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  };

  // Hold Left/Right Controls
  const startHoldMove = (direction: 'left' | 'right') => {
    sound.resumeContext();
    activeHoldDirectionRef.current = direction;
  };

  const stopHoldMove = () => {
    activeHoldDirectionRef.current = null;
  };

  const maxBasketPosition = Math.max(1, (containerRef.current?.clientWidth || gameWidth) - BASKET_WIDTH);

  return (
    <div 
      onClick={() => {
        sound.playClick();
        onBack();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#18061a] border-2 border-pink-400/70 rounded-3xl p-3.5 sm:p-5 max-w-md w-full shadow-[0_0_50px_rgba(244,114,182,0.35)] relative flex flex-col items-center max-h-[95vh] overflow-y-auto"
      >
        {/* Header Bar */}
        <div className="w-full flex items-center justify-between mb-2.5 border-b border-pink-500/30 pb-2">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-pink-950/90 border border-pink-500/40 text-pink-200 hover:bg-pink-900 active:scale-95 transition-all cursor-pointer"
            title="Back to Arcade"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="font-serif-fancy font-bold text-xs sm:text-sm text-pink-200 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-400 fill-current animate-pulse" />
            <span>Princess Heart Catcher</span>
          </div>

          <div className="flex items-center gap-1.5">
            {highScore > 0 && (
              <div className="font-mono text-[10px] text-pink-300/80 bg-pink-950/60 px-2 py-0.5 rounded-lg border border-pink-500/20">
                BEST: {highScore}
              </div>
            )}
            <div className="font-mono text-xs font-bold text-amber-300 bg-pink-950/80 px-2.5 py-1 rounded-xl border border-pink-500/30">
              {score} / {targetScore}
            </div>
          </div>
        </div>

        {/* Lives & Powerups Bar */}
        <div className="w-full flex items-center justify-between text-xs font-mono text-pink-300 mb-2 px-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-pink-400 mr-1 font-bold">Hearts:</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm transition-transform duration-300 ${
                  i < lives ? 'scale-100 text-pink-400' : 'scale-75 opacity-30 text-gray-500'
                }`}
              >
                {i < lives ? '💖' : '🖤'}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-amber-300 font-bold bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span>👑 +5</span>
              <span>✨ +3</span>
              <span>🌸 +2</span>
            </span>
          </div>

          <span className="text-[10px] font-mono text-rose-300/90 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Dodge 💣 -2</span>
          </span>
        </div>

        {/* Game Canvas Box */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-[380px] bg-gradient-to-b from-[#200823] via-[#140417] to-[#0a020c] border-2 border-pink-500/50 rounded-2xl overflow-hidden shadow-inner cursor-ew-resize select-none touch-none"
          style={{ touchAction: 'none' }}
        >
          {/* Cyber Grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(244,114,182,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,114,182,0.2) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Falling items with GPU accelerated transform */}
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none filter drop-shadow-md text-2xl select-none will-change-transform"
              style={{
                transform: `translate3d(${item.x - 14}px, ${item.y - 14}px, 0)`,
                top: 0,
                left: 0,
              }}
            >
              {item.icon}
            </div>
          ))}

          {/* Floating Score Popups */}
          {popups.map((popup) => (
            <div
              key={popup.id}
              className="absolute pointer-events-none text-xs font-mono font-bold animate-bounce z-20 will-change-transform"
              style={{
                transform: `translate3d(${popup.x}px, ${popup.y}px, 0) translate(-50%, -50%)`,
                top: 0,
                left: 0,
                color: popup.color,
                textShadow: '0 0 8px rgba(0,0,0,0.9)',
              }}
            >
              {popup.text}
            </div>
          ))}

          {/* Player Royal Basket with GPU Accelerated Transform */}
          <div
            className={`absolute bottom-3.5 h-9 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 rounded-2xl border-2 border-white flex items-center justify-center text-[11px] font-serif-fancy text-[#1a0418] font-black tracking-wide pointer-events-none will-change-transform transition-shadow ${
              basketSparkle 
                ? 'shadow-[0_0_25px_rgba(251,191,36,0.9)] scale-105' 
                : 'shadow-[0_0_15px_rgba(244,114,182,0.8)]'
            }`}
            style={{
              transform: `translate3d(${basketX}px, 0, 0)`,
              left: 0,
              width: `${BASKET_WIDTH}px`,
            }}
          >
            <span className="truncate px-1">👑 HANNA</span>
          </div>

          {/* Catch Glow Ground Line */}
          <div className="absolute bottom-2 inset-x-2 h-0.5 bg-pink-500/30 rounded-full" />

          {/* Game Over Overlay */}
          {gameOver && (
            <div 
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 bg-[#120213]/95 flex flex-col items-center justify-center p-4 text-center z-40 pointer-events-auto"
            >
              <div className="text-4xl mb-2">💔</div>
              <h3 className="font-serif-fancy font-bold text-base text-rose-300 mb-1">
                SO CLOSE, PRINCESS!
              </h3>
              <p className="font-sans text-xs text-pink-200 mb-4 leading-relaxed max-w-xs">
                You collected {score} / {targetScore} points before running out of hearts. Let&apos;s catch more love!
              </p>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestart();
                }}
                className="px-6 py-3 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-black font-serif-fancy font-bold text-xs rounded-2xl flex items-center gap-2 hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(244,114,182,0.5)] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>TRY AGAIN</span>
              </button>
            </div>
          )}

          {/* Game Won Overlay */}
          {gameWon && (
            <div 
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 bg-[#240726]/95 border-2 border-amber-300 flex flex-col items-center justify-center p-4 text-center z-40 pointer-events-auto"
            >
              <Trophy className="w-14 h-14 text-amber-300 animate-bounce mb-2" />
              <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-1">
                CHALLENGE CLEARED!
              </h3>
              <p className="font-sans text-xs text-pink-100 mb-2 leading-relaxed">
                Score: {score} / {targetScore} points caught! 👑💖<br />
                {score > highScore && highScore > 0 ? (
                  <span className="text-amber-300 font-bold">✨ NEW RECORD HIGH SCORE! ✨<br /></span>
                ) : null}
                Earned +20 XP toward your Level 23 Birthday Vault!
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-[10px] font-mono text-emerald-300 mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SAVE POINT RECORDED TO MEMORY</span>
              </div>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onBack();
                }}
                className="px-7 py-3.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-extrabold text-xs rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:brightness-110 active:scale-95 cursor-pointer uppercase tracking-wider z-50 pointer-events-auto"
              >
                CLAIM +20 XP &amp; EXIT
              </button>
            </div>
          )}
        </div>

        {/* Dedicated Smooth Range Slider Bar */}
        <div className="w-full mt-3 px-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-pink-300/80 mb-1">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-pink-400" />
              <span>SMOOTH BASKET SLIDER</span>
            </span>
            <span>{Math.round((basketX / maxBasketPosition) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxBasketPosition}
            value={basketX}
            onChange={(e) => {
              setBasketX(Number(e.target.value));
            }}
            className="w-full h-3 bg-[#1e0721] rounded-lg appearance-none cursor-ew-resize accent-pink-400 border border-pink-500/40 shadow-inner"
          />
        </div>

        {/* Touch Hold Buttons for Left / Right */}
        <div className="flex items-center justify-between w-full mt-2.5 gap-2 select-none">
          <button
            onPointerDown={() => startHoldMove('left')}
            onPointerUp={stopHoldMove}
            onPointerLeave={stopHoldMove}
            onPointerCancel={stopHoldMove}
            className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#280c2b] to-[#1e0721] border border-pink-500/40 text-pink-200 font-mono text-xs font-bold active:bg-pink-900 active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1 transition-transform touch-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>HOLD LEFT</span>
          </button>
          
          <button
            onPointerDown={() => startHoldMove('right')}
            onPointerUp={stopHoldMove}
            onPointerLeave={stopHoldMove}
            onPointerCancel={stopHoldMove}
            className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#1e0721] to-[#280c2b] border border-pink-500/40 text-pink-200 font-mono text-xs font-bold active:bg-pink-900 active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1 transition-transform touch-none"
          >
            <span>HOLD RIGHT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] font-sans text-pink-300/75 mt-2 text-center">
          📱 Drag on the screen, slide the pink bar, use arrow keys, or hold buttons!
        </p>
      </div>
    </div>
  );
};
