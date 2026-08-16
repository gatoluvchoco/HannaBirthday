import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';
import { Heart, Sparkles, Crown, Play, Gift } from 'lucide-react';

interface LoadingScreenProps {
  onStart: () => void;
  onResetProgress?: () => void;
  girlfriendName: string;
  level: number;
  savedXP?: number;
  targetXP?: number;
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

  const handleStart = () => {
    sound.playLevelUp();
    sound.startBGM(0);
    onStart();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-[#140616]/90 border-2 border-pink-400/60 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(244,114,182,0.3)] relative overflow-hidden"
      >
        {/* Top Window Bar */}
        <div className="flex items-center justify-between border-b border-pink-500/25 pb-3 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-pink-400 animate-pulse shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-300" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-pink-300 ml-2 tracking-widest font-semibold flex items-center gap-1">
              <span>🎀</span>
              <span>PRINCESS_BOOT // {girlfriendName.toUpperCase()} &bull; LEVEL {level}</span>
            </span>
          </div>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        </div>

        {/* Title */}
        <div className="text-center my-4">
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
        <div className="my-6">
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
        <div className="bg-[#0c030d] border border-pink-900/50 rounded-2xl p-3.5 my-4 font-mono text-xs text-pink-300 min-h-[95px] flex flex-col justify-end shadow-inner">
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
        <div className="mt-6 flex flex-col items-center gap-3">
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

          {isLoaded ? (
            <motion.button
              onClick={handleStart}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: [1, 1.03, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-serif-fancy font-black text-base rounded-2xl shadow-[0_0_30px_rgba(244,114,182,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>👑</span>
              <span>{savedXP > 0 ? `CONTINUE ADVENTURE (${savedXP} XP)` : 'ENTER THE SANCTUARY'}</span>
              <Heart className="w-5 h-5 fill-rose-600 text-rose-600 animate-ping" />
            </motion.button>
          ) : (
            <div className="text-xs font-mono text-pink-300/80 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
              Preparing your royal Level {level} celebration...
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-[11px] font-sans text-pink-300/60 border-t border-pink-900/40 pt-3">
          Crafted with endless devotion for Hanna by Afiq &bull; Level {level} &bull; 20 August
        </div>
      </motion.div>
    </div>
  );
};
