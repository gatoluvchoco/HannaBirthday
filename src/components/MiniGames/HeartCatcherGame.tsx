import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Trophy, RefreshCw, X, Sparkles, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';

interface HeartCatcherGameProps {
  onBack: () => void;
  onWin: (score?: number) => void;
}

interface FallingItem {
  id: number;
  x: number; // percentage (0 to 100) or pixel
  y: number; // pixel
  speed: number;
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

export const HeartCatcherGame: React.FC<HeartCatcherGameProps> = ({ onBack, onWin }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game field dimensions
  const GAME_HEIGHT = 380;
  const BASKET_WIDTH = 76;
  const [gameWidth, setGameWidth] = useState(300);

  // Position in pixels
  const [basketX, setBasketX] = useState(112);
  const [score, setScore] = useState(0);
  const targetScore = 15;
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [basketSparkle, setBasketSparkle] = useState(false);

  // Dragging state
  const isDraggingRef = useRef(false);
  const moveIntervalRef = useRef<number | null>(null);

  // Update container size dynamically on mount / resize for perfect responsiveness
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setGameWidth(width);
          setBasketX(prev => Math.min(width - BASKET_WIDTH, Math.max(0, prev)));
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [BASKET_WIDTH]);

  // Spawn and Physics Loop
  useEffect(() => {
    if (gameOver || gameWon) return;

    // Item Spawner
    const spawnInterval = window.setInterval(() => {
      const rand = Math.random();
      let type: FallingItem['type'] = 'pink';
      let icon = '💖';
      let points = 1;

      if (rand < 0.22) {
        type = 'gold';
        icon = '👑';
        points = 3;
      } else if (rand < 0.42) {
        type = 'rose';
        icon = '🌸';
        points = 2;
      } else if (rand < 0.60) {
        type = 'star';
        icon = '✨';
        points = 2;
      } else if (rand < 0.78) {
        type = 'glitch';
        icon = '💣';
        points = -1;
      }

      // Spawn anywhere within the playable width
      const effectiveWidth = gameWidth > 0 ? gameWidth : 300;
      const xPos = 16 + Math.random() * (effectiveWidth - 48);

      const newItem: FallingItem = {
        id: Date.now() + Math.random(),
        x: xPos,
        y: -30,
        speed: 2.2 + Math.random() * 2.0,
        type,
        icon,
        points
      };

      setItems(prev => [...prev, newItem]);
    }, 520);

    // Physics Animation Step
    const physicsInterval = window.setInterval(() => {
      let caughtGlitch = false;
      let caughtGoodItem: FallingItem | null = null;

      setItems(prev => {
        const nextList: FallingItem[] = [];
        const catchZoneTop = GAME_HEIGHT - 65;
        const catchZoneBottom = GAME_HEIGHT - 10;

        for (const item of prev) {
          const nextY = item.y + item.speed;

          // Collision detection with Basket
          if (nextY >= catchZoneTop && nextY <= catchZoneBottom) {
            const itemCenter = item.x + 14;
            const basketLeft = basketX;
            const basketRight = basketX + BASKET_WIDTH;

            if (itemCenter >= basketLeft - 4 && itemCenter <= basketRight + 4) {
              if (item.type === 'glitch') {
                caughtGlitch = true;
              } else {
                caughtGoodItem = item;
              }
              continue; // remove item from falling list
            }
          }

          // If still on screen, keep falling
          if (nextY < GAME_HEIGHT + 10) {
            nextList.push({ ...item, y: nextY });
          }
        }
        return nextList;
      });

      // Handle collisions cleanly outside setItems updater
      if (caughtGlitch) {
        sound.playPop();
        setLives(l => {
          const remaining = l - 1;
          if (remaining <= 0) {
            setGameOver(true);
          }
          return Math.max(0, remaining);
        });
        addScorePopup(basketX + BASKET_WIDTH / 2, GAME_HEIGHT - 60, '-1 💔', '#f87171');
      } else if (caughtGoodItem) {
        const item: FallingItem = caughtGoodItem;
        sound.playHeartCatch();
        setBasketSparkle(true);
        setTimeout(() => setBasketSparkle(false), 250);

        const pointText = item.points > 1 ? `+${item.points} ${item.icon}` : '+1 💖';
        const color = item.type === 'gold' ? '#fbbf24' : item.type === 'rose' ? '#f472b6' : '#fda4af';
        addScorePopup(item.x, item.y, pointText, color);

        setScore(s => {
          const newScore = s + item.points;
          if (newScore >= targetScore && !gameWon) {
            setGameWon(true);
            sound.playLevelUp();
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#f472b6', '#fbbf24', '#ffffff', '#fda4af', '#e879f9']
            });
            setTimeout(() => {
              onWin(newScore);
            }, 10);
          }
          return newScore;
        });
      }
    }, 28);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(physicsInterval);
    };
  }, [gameOver, gameWon, basketX, gameWidth, targetScore, onWin]);

  const addScorePopup = (x: number, y: number, text: string, color: string) => {
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
  };

  // Keyboard navigation for Desktop / Laptops
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX(x => Math.max(0, x - 26));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX(x => Math.min(gameWidth - BASKET_WIDTH, x + 26));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameWidth, BASKET_WIDTH]);

  // Pointer Dragging for iOS, Android, and Desktop Touch/Mouse
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

  const updateBasketFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left - BASKET_WIDTH / 2;
    const clamped = Math.max(0, Math.min(gameWidth - BASKET_WIDTH, relativeX));
    setBasketX(clamped);
  }, [gameWidth, BASKET_WIDTH]);

  // Continuous Smooth Button Movement (Hold to Move)
  const startMove = (direction: 'left' | 'right') => {
    sound.resumeContext();
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);

    const step = direction === 'left' ? -9 : 9;
    setBasketX(x => Math.max(0, Math.min(gameWidth - BASKET_WIDTH, x + step * 2)));

    moveIntervalRef.current = window.setInterval(() => {
      setBasketX(x => Math.max(0, Math.min(gameWidth - BASKET_WIDTH, x + step)));
    }, 22);
  };

  const stopMove = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  const restartGame = () => {
    sound.playClick();
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setItems([]);
    setPopups([]);
    setBasketX((gameWidth - BASKET_WIDTH) / 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md select-none touch-none">
      <div className="bg-[#19071c] border-2 border-pink-400/80 rounded-3xl p-4 sm:p-5 max-w-sm w-full shadow-[0_0_50px_rgba(244,114,182,0.4)] flex flex-col items-center relative max-h-[96vh] overflow-y-auto">
        
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

          <div className="font-mono text-xs font-bold text-amber-300 bg-pink-950/80 px-2.5 py-1 rounded-xl border border-pink-500/30">
            {score} / {targetScore}
          </div>
        </div>

        {/* Status / Lives Bar */}
        <div className="w-full flex justify-between items-center text-xs font-mono mb-2 px-1 text-pink-200">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-pink-300/80">LIVES:</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <span 
                key={i} 
                className={`text-sm transition-transform duration-300 ${i < lives ? 'text-pink-400 scale-100' : 'text-stone-700 opacity-40 scale-90'}`}
              >
                💖
              </span>
            ))}
          </div>
          <span className="text-[10px] font-mono text-rose-300/90 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Dodge 💣 Glitches</span>
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
          {/* Subtle Cyber Grid in Canvas */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(244,114,182,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,114,182,0.2) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Falling items */}
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none filter drop-shadow-md text-2xl select-none"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {item.icon}
            </div>
          ))}

          {/* Floating Score Popups */}
          {popups.map((popup) => (
            <div
              key={popup.id}
              className="absolute pointer-events-none text-xs font-mono font-bold animate-bounce z-20"
              style={{
                left: `${popup.x}px`,
                top: `${popup.y}px`,
                color: popup.color,
                textShadow: '0 0 8px rgba(0,0,0,0.9)',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {popup.text}
            </div>
          ))}

          {/* Player Royal Basket */}
          <div
            className={`absolute bottom-3.5 h-9 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 rounded-2xl border-2 border-white flex items-center justify-center text-[11px] font-serif-fancy text-[#1a0418] font-black tracking-wide pointer-events-none transition-shadow ${
              basketSparkle 
                ? 'shadow-[0_0_25px_rgba(251,191,36,0.9)] scale-105' 
                : 'shadow-[0_0_15px_rgba(244,114,182,0.8)]'
            }`}
            style={{
              left: `${basketX}px`,
              width: `${BASKET_WIDTH}px`,
            }}
          >
            <span className="truncate px-1">👑 HANNA</span>
          </div>

          {/* Catch Glow Ground Line */}
          <div className="absolute bottom-2 inset-x-2 h-0.5 bg-pink-500/30 rounded-full" />

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-[#120213]/95 flex flex-col items-center justify-center p-4 text-center z-30">
              <div className="text-4xl mb-2">💔</div>
              <h3 className="font-serif-fancy font-bold text-base text-rose-300 mb-1">
                SO CLOSE, PRINCESS!
              </h3>
              <p className="font-sans text-xs text-pink-200 mb-5 leading-relaxed">
                You caught {score} / {targetScore} hearts.<br />
                Afiq believes in you! Give it another shot!
              </p>
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-black font-serif-fancy font-bold text-xs rounded-2xl flex items-center gap-2 hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(244,114,182,0.5)] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>TRY AGAIN</span>
              </button>
            </div>
          )}

          {/* Game Won Overlay */}
          {gameWon && (
            <div className="absolute inset-0 bg-[#240726]/95 border-2 border-amber-300 flex flex-col items-center justify-center p-4 text-center z-30">
              <Trophy className="w-14 h-14 text-amber-300 animate-bounce mb-2" />
              <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-1">
                CHALLENGE CLEARED!
              </h3>
              <p className="font-sans text-xs text-pink-100 mb-5 leading-relaxed">
                Score: {score} hearts caught! 👑💖<br />
                Earned +20 XP toward your Level 23 Birthday Vault!
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  onBack();
                }}
                className="px-7 py-3.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-black font-serif-fancy font-extrabold text-xs rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:brightness-110 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                CLAIM +20 XP &amp; EXIT
              </button>
            </div>
          )}
        </div>

        {/* Touch Button Controls for iOS / Android */}
        <div className="flex items-center justify-between w-full mt-3 gap-2 select-none">
          <button
            onPointerDown={() => startMove('left')}
            onPointerUp={stopMove}
            onPointerLeave={stopMove}
            onPointerCancel={stopMove}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#280c2b] to-[#1e0721] border border-pink-500/40 text-pink-200 font-mono text-xs font-bold active:bg-pink-900 active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1 transition-transform touch-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>HOLD LEFT</span>
          </button>
          
          <button
            onPointerDown={() => startMove('right')}
            onPointerUp={stopMove}
            onPointerLeave={stopMove}
            onPointerCancel={stopMove}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#1e0721] to-[#280c2b] border border-pink-500/40 text-pink-200 font-mono text-xs font-bold active:bg-pink-900 active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1 transition-transform touch-none"
          >
            <span>HOLD RIGHT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] font-sans text-pink-300/75 mt-2 text-center">
          📱 Drag directly on screen or hold left/right buttons to catch hearts!
        </p>
      </div>
    </div>
  );
};
