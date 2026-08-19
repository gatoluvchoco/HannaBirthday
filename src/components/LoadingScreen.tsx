import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Crown, Lock, Unlock, Timer, Flame } from 'lucide-react';

interface LoadingScreenProps {
  onStart: () => void;
  onResetProgress?: () => void;
  girlfriendName: string;
  level: number;
  savedXP?: number;
  targetXP?: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onStart,
  onResetProgress,
  girlfriendName,
  level,
  savedXP = 0,
  targetXP = 100,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Playful Runaway Button State (25s timer / dodge mechanic)
  const [countdown, setCountdown] = useState(25);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasStartedDodging, setHasStartedDodging] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0, rotate: 0 });
  const [teaserQuote, setTeaserQuote] = useState<string>('');
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const lastDodgeTime = useRef<number>(0);

  const ordinal = level === 23 ? '23RD' : level === 21 ? '21ST' : level === 22 ? '22ND' : `${level}TH`;

  const statusMessages = [
    `Initializing ${girlfriendName}'s royal chamber...`,
    savedXP > 0 
      ? `Restoring saved player progress (${savedXP} / ${targetXP} XP)...`
      : "Gathering starlight, pink peonies, and sweet memories...",
    "Polishing the custom rose-gold Porsche GT3 RS...",
    "Connecting live telemetry to Birmingham UK (BST)...",
    "Synthesizing romantic lo-fi starlight frequencies...",
    "Allocating infinite hugs, iced matchas, and princess affection...",
    "Arranging diamond tiaras & birthday candles...",
    `100% READY! HAPPY ${ordinal} BIRTHDAY MY QUEEN 👑💖✨`
  ];

  const playfulQuotes = [
    "Eeep! Too fast for you, my princess! 🏃‍♀️💨",
    "Catch me if you can! 💖",
    "Afiq programmed me to tease you! 🤭",
    "Too quick! Only 23% caught! 🏎️💨",
    "Almost got it! Reach a little faster! 💌",
    "Charging with 1,000,000 kisses first... 💋✨",
    "Gotta be swifter than a Porsche GT3 RS! 🏎️",
    "Aww, so close! Keep chasing! 🥰",
    "Still gathering starlight & cuddles! 🧸⭐",
    "Hehehe, try the other corner! 🌸✨",
    "Princess reflexes test: IN PROGRESS! 🎀",
    "No easy coronation without a little chase! 👑",
    "Fueling with iced matcha & chocolate cake! 🍵🍰",
    "Afiq said you have to catch my heart first! ❤️"
  ];

  // Loading progress bar simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8 + 4);
        if (next >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          sound.playSparkle();
          return 100;
        }
        return next;
      });
    }, 170);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer for button unlock (starts once loaded and user begins trying to catch it)
  useEffect(() => {
    if (!isLoaded || !hasStartedDodging) return;

    if (countdown <= 0) {
      setIsUnlocked(true);
      setBtnOffset({ x: 0, y: 0, rotate: 0 });
      sound.playSparkle();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsUnlocked(true);
          setBtnOffset({ x: 0, y: 0, rotate: 0 });
          sound.playSparkle();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoaded, hasStartedDodging, countdown]);

  useEffect(() => {
    const step = Math.min(
      Math.floor((progress / 100) * statusMessages.length),
      statusMessages.length - 1
    );
    if (step !== statusIndex) {
      setStatusIndex(step);
      setLogs((prev) => [...prev.slice(-3), `> ${statusMessages[step]}`]);
      sound.playTypewriter();
    }
  }, [progress, statusIndex, statusMessages]);

  // Handle dodge when pointer tries to hover or touch the Continue button
  const handleDodge = useCallback(() => {
    if (isUnlocked) return;

    const now = Date.now();
    if (now - lastDodgeTime.current < 200) return; // debounce spam
    lastDodgeTime.current = now;

    setHasStartedDodging(true);
    sound.playPop();

    // Random safe offsets
    const isMobile = window.innerWidth < 640;
    const maxX = isMobile ? 80 : 160;
    const maxY = isMobile ? 55 : 90;

    const newX = Math.random() * (maxX * 2) - maxX;
    const newY = Math.random() * (maxY * 2) - maxY;
    const newRot = Math.random() * 20 - 10;

    setBtnOffset({ x: newX, y: newY, rotate: newRot });
    setDodgeCount((prev) => prev + 1);

    const randomQuote = playfulQuotes[Math.floor(Math.random() * playfulQuotes.length)];
    setTeaserQuote(randomQuote);

    // Floating heart emojis
    const emojis = ['💖', '💨', '✨', '🌸', '🏎️', '👑', '🎀'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const heartId = Date.now() + Math.random();
    setFloatingHearts((prev) => [
      ...prev.slice(-6),
      { id: heartId, x: newX, y: newY, emoji: randomEmoji }
    ]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 1200);
  }, [isUnlocked, playfulQuotes]);

  const handleStart = () => {
    if (!isUnlocked) {
      handleDodge();
      return;
    }

    sound.playLevelUp();
    sound.playHappyBirthday();
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fbbf24', '#fda4af', '#fbcfe8', '#ffffff']
    });
    onStart();
  };

  const buttonText = savedXP > 0 
    ? `CONTINUE ADVENTURE (${savedXP} XP)` 
    : 'ENTER THE SANCTUARY';

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 z-10 select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-[#140616]/92 border-2 border-pink-400/60 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(244,114,182,0.35)] relative overflow-hidden"
      >
        {/* Top Window Bar */}
        <div className="flex items-center justify-between border-b border-pink-500/25 pb-3 mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-300" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-pink-300 ml-2 tracking-widest font-semibold flex items-center gap-1">
              <span>🎀</span>
              <span>ROYAL_BOOT // {girlfriendName.toUpperCase()} &bull; LEVEL {level}</span>
            </span>
          </div>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        </div>

        {/* Title */}
        <div className="text-center my-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-400/40 text-[11px] font-mono text-pink-200 mb-2 shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>HER ROYAL HIGHNESS SPECIAL EDITION</span>
          </div>

          <motion.h1 
            className="font-serif-fancy text-3xl sm:text-4xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 drop-shadow-md mb-1"
          >
            {girlfriendName}
          </motion.h1>
          <div className="font-script text-xl text-pink-300">
            Level {level} Birthday Coronation
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="my-5">
          <div className="flex justify-between text-xs font-mono text-pink-200 font-bold mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>SYNCING SWEET MEMORIES</span>
            </span>
            <span className="text-amber-300">{progress}%</span>
          </div>
          <div className="w-full h-4 bg-[#0a030b] rounded-full border border-pink-500/40 p-0.5 overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 rounded-full shadow-[0_0_15px_rgba(244,114,182,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Terminal Boot Log */}
        <div className="bg-[#0c030d] border border-pink-900/50 rounded-2xl p-3.5 my-4 font-mono text-xs text-pink-300 min-h-[90px] flex flex-col justify-end shadow-inner">
          <div className="flex items-center gap-2 text-[10px] text-pink-400 font-bold mb-1 border-b border-pink-900/40 pb-1 uppercase tracking-wider">
            <span>✨</span>
            <span>SYSTEM CONSOLE // BIRMINGHAM BST TELEMETRY</span>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="leading-relaxed truncate text-pink-100 font-sans text-xs">
              {log}
            </div>
          ))}
          <div className="animate-pulse text-pink-400 text-xs mt-0.5">_</div>
        </div>

        {/* Start Button & Saved Progress Handling */}
        <div className="mt-5 flex flex-col items-center gap-3">
          {savedXP > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="text-[11px] font-mono text-amber-300 bg-amber-950/70 border border-amber-400/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>SAVED PROGRESS DETECTED: {savedXP} / {targetXP} XP</span>
              </div>
              {onResetProgress && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onResetProgress();
                  }}
                  className="text-[11px] font-mono text-pink-300 hover:text-white bg-pink-950/80 border border-pink-500/40 px-2.5 py-1 rounded-full hover:bg-pink-900 transition-colors cursor-pointer"
                  title="Reset to 0 XP and start fresh"
                >
                  ↺ Start at 0 XP
                </button>
              )}
            </div>
          )}

          {/* Teaser status bar when button is running away */}
          {isLoaded && !isUnlocked && (
            <div className="w-full text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/40 text-[11px] font-mono text-amber-300 shadow-sm animate-pulse">
                <Timer className="w-3.5 h-3.5 text-amber-300" />
                <span>Teasing Princess: {countdown}s left &bull; {dodgeCount} dodges</span>
              </div>
              {teaserQuote && (
                <div className="text-xs font-sans text-pink-200 mt-1.5 italic font-medium">
                  "{teaserQuote}"
                </div>
              )}
            </div>
          )}

          {isLoaded && isUnlocked && (
            <div className="text-center text-xs font-serif-fancy font-bold text-amber-200 flex items-center justify-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>💖 BUTTON CAUGHT! READY FOR MY QUEEN 👑</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
          )}

          {/* The Runaway Button Area */}
          <div className="w-full relative min-h-[70px] flex items-center justify-center">
            {/* Floating emojis on dodge */}
            {floatingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 1, scale: 0.6, y: heart.y, x: heart.x }}
                animate={{ opacity: 0, scale: 1.4, y: heart.y - 35 }}
                transition={{ duration: 1.0 }}
                className="absolute pointer-events-none text-base z-30"
              >
                {heart.emoji}
              </motion.div>
            ))}

            {isLoaded ? (
              <motion.button
                onClick={handleStart}
                onMouseEnter={handleDodge}
                onTouchStart={handleDodge}
                animate={{
                  x: btnOffset.x,
                  y: btnOffset.y,
                  rotate: btnOffset.rotate,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 24,
                  mass: 0.6,
                }}
                className={`w-full py-4 px-6 font-serif-fancy font-black text-base rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] shadow-[0_0_35px_rgba(244,114,182,0.7)] hover:brightness-110 active:scale-95 glow-pink glow-gold'
                    : 'bg-gradient-to-r from-pink-500/80 via-purple-600/80 to-rose-500/80 text-pink-100 border border-pink-400/50 shadow-[0_0_20px_rgba(244,114,182,0.4)]'
                }`}
              >
                <span>{isUnlocked ? '👑' : '🏃‍♀️💨'}</span>
                <span>{isUnlocked ? buttonText : `CATCH ME: ${buttonText}`}</span>
                {isUnlocked ? (
                  <Heart className="w-5 h-5 fill-rose-600 text-rose-600 animate-ping" />
                ) : (
                  <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
                )}
              </motion.button>
            ) : (
              <div className="text-xs font-mono text-pink-300/80 animate-pulse flex items-center gap-2 py-3">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                Preparing your royal Level {level} celebration...
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-[11px] font-sans text-pink-300/60 border-t border-pink-900/40 pt-3">
          Crafted with endless devotion for Hanna by Afiq &bull; Level {level} &bull; 20 August
        </div>
      </motion.div>
    </div>
  );
};

