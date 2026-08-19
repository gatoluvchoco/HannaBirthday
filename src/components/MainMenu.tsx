import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';
import { ActiveSection, UserProgress } from '../types';
import { Play, Pause, RotateCcw, ArrowRight, Heart, Sparkles, Crown, Gift, Music, Clock, Map, LayoutGrid } from 'lucide-react';
import { LevelMap } from './LevelMap';

interface MainMenuProps {
  onNavigate: (section: ActiveSection) => void;
  xp: number;
  targetXP: number;
  musicTitle?: string;
  visitedSections: string[];
  gamesWon: string[];
  progress?: UserProgress;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNavigate,
  xp,
  targetXP,
  musicTitle,
  visitedSections,
  gamesWon,
  progress,
}) => {
  const isFinalUnlocked = xp >= targetXP;
  const syncRemaining = Math.max(0, targetXP - xp);

  // Tab View state: 'bento' vs 'map'
  const [viewMode, setViewMode] = useState<'bento' | 'map'>('bento');

  // Live Birmingham UK (BST) Time Clock & 20 August Countdown
  const [birminghamTime, setBirminghamTime] = useState('');
  const [daysUntil, setDaysUntil] = useState(0);
  const [isTodayBirthday, setIsTodayBirthday] = useState(false);

  // Audio state in Bento Box
  const [isPlaying, setIsPlaying] = useState(sound.isPlayingBGM());

  const currentProgress: UserProgress = progress || {
    xp,
    visitedSections,
    interactedObjects: [],
    gamesWon,
    letterOpened: visitedSections.includes('letter'),
    candlesBlown: visitedSections.includes('candles'),
    redeemedCoupons: [],
    easterEggFound: false,
  };

  useEffect(() => {
    const updateBirminghamClock = () => {
      const now = new Date();

      // Format current time in Birmingham (Europe/London)
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setBirminghamTime(timeStr);

      // Extract current Birmingham date
      const birminghamDateStr = now.toLocaleString('en-US', { timeZone: 'Europe/London' });
      const birminghamDate = new Date(birminghamDateStr);
      const birminghamYear = birminghamDate.getFullYear();
      const birminghamMonth = birminghamDate.getMonth(); // 0 = Jan, 7 = Aug
      const birminghamDay = birminghamDate.getDate();

      const isAug20 = birminghamMonth === 7 && birminghamDay === 20;
      setIsTodayBirthday(isAug20);

      // Compute target August 20
      let targetYear = birminghamYear;
      if (birminghamMonth > 7 || (birminghamMonth === 7 && birminghamDay > 20)) {
        targetYear += 1;
      }

      const targetMidnight = new Date(targetYear, 7, 20, 0, 0, 0);
      const currentMidnight = new Date(birminghamYear, birminghamMonth, birminghamDay, 0, 0, 0);
      const diffDays = Math.round((targetMidnight.getTime() - currentMidnight.getTime()) / (1000 * 60 * 60 * 24));

      setDaysUntil(isAug20 ? 0 : Math.max(1, diffDays));
    };

    updateBirminghamClock();
    const interval = setInterval(updateBirminghamClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Play Happy Birthday theme exclusively on the Home Screen / Sanctuary
    sound.playHappyBirthday();
    setIsPlaying(sound.isPlayingBGM());

    const audioSyncInterval = setInterval(() => {
      setIsPlaying(sound.isPlayingBGM());
    }, 500);
    return () => clearInterval(audioSyncInterval);
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    if (isPlaying) {
      sound.stopBGM();
      setIsPlaying(false);
    } else {
      sound.playHappyBirthday();
      setIsPlaying(true);
    }
  };

  const handleRestartSong = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    sound.stopBGM();
    sound.playHappyBirthday();
    setIsPlaying(true);
  };

  const handleOpenSection = (section: ActiveSection, locked?: boolean) => {
    if (locked) {
      sound.playPop();
      alert(`👑 Her Royal Highness Vault requires 100% synchronization (${syncRemaining} more XP). Play royal mini-games or inspect sweet memories to unlock! 💖✨`);
      return;
    }
    sound.playClick();
    onNavigate(section);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-2 z-10 flex flex-col gap-5">
      {/* View Switcher: Interactive Level Map vs Royal Bento Grid */}
      <div className="flex items-center justify-between gap-3 bg-[#160717]/80 border border-pink-500/30 rounded-2xl p-2 px-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setViewMode('bento');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'bento'
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                : 'text-pink-300/70 hover:text-pink-200 hover:bg-pink-950/60'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>BENTO GRID</span>
          </button>

          <button
            onClick={() => {
              sound.playSparkle();
              setViewMode('map');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-[#120512] shadow-[0_0_18px_rgba(251,191,36,0.5)] font-black'
                : 'text-pink-300/70 hover:text-pink-200 hover:bg-pink-950/60'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-amber-300" />
            <span>LEVEL MAP VIEW</span>
            <span className="text-[9px] bg-pink-950/90 text-pink-200 px-1.5 py-0.2 rounded border border-pink-500/40">
              NEW 🌟
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-pink-300/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{viewMode === 'map' ? 'Interactive Journey Path' : 'Quick Access Dashboard'}</span>
        </div>
      </div>

      {/* Conditionally Render Level Map or Royal Bento Grid */}
      {viewMode === 'map' ? (
        <LevelMap
          progress={currentProgress}
          targetXP={targetXP}
          onSelectSection={onNavigate}
          canUnlockVault={isFinalUnlocked}
        />
      ) : (
        /* Bento Grid Container */
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 flex-grow">
        
        {/* BENTO ITEM 1 (2x2): Featured Romantic Memory / Story */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => handleOpenSection('story')}
          className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-[#1c081e]/90 via-[#150616]/95 to-[#0e0310]/95 border border-pink-500/30 hover:border-pink-400/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between backdrop-blur-xl cursor-pointer group hover:shadow-[0_0_30px_rgba(244,114,182,0.25)] transition-all select-none relative overflow-hidden"
        >
          {/* Subtle background rose glow */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-pink-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/20 transition-all" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1a0518] inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                <span>🎀</span>
                <span>FEATURED MILESTONE</span>
              </span>
              <span className="text-xs font-mono text-pink-300/80 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span className="font-sans">Explore Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif-fancy font-bold text-white group-hover:text-pink-200 transition-colors leading-tight">
              The Golden Hours
            </h2>
            <p className="text-pink-100/75 text-xs sm:text-sm leading-relaxed mt-2.5 font-sans">
              That magical time of day when the sun melts into warm amber skies, everything softens in gentle glowing light, and every quiet second together feels completely timeless and warm.
            </p>
          </div>

          {/* Direct GIF Image Frame */}
          <div className="mt-4 h-48 sm:h-52 bg-[#0a030c] border border-pink-500/40 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:border-pink-400 transition-colors shadow-lg">
            <img 
              src="https://i.postimg.cc/ZRPj1bHf/pic5.gif" 
              style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} 
              alt="The Golden Hours" 
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-2.5 right-3 font-mono text-[10px] text-pink-200 bg-black/70 px-2.5 py-0.5 rounded-full border border-pink-500/40 flex items-center gap-1 backdrop-blur-md shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>THE GOLDEN HOURS // 2024 - 2026</span>
            </div>
          </div>
        </motion.div>

        {/* BENTO ITEM 2 (1x1): Princess Mini Games */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          onClick={() => handleOpenSection('games-menu')}
          className="lg:col-span-1 lg:row-span-1 bg-gradient-to-br from-[#1c091f]/90 to-[#120514]/90 border border-pink-500/30 hover:border-pink-400/80 rounded-3xl p-5 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer group hover:scale-[1.02] transition-all shadow-[0_4px_20px_rgba(244,114,182,0.12)] select-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-900/60 to-purple-900/40 border border-pink-500/40 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-md">
            🎮
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
              Royal Arcade
            </h3>
            <p className="text-xs text-pink-300/90 font-mono mt-0.5">
              {gamesWon.length > 0 ? `✨ ${gamesWon.length}/5 Cleared` : '5 Cute Challenges'}
            </p>
          </div>
        </motion.div>

        {/* BENTO ITEM 3 (1x1): Future Bucket List & Wish Lanterns */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          onClick={() => handleOpenSection('room')}
          className="lg:col-span-1 lg:row-span-1 bg-gradient-to-br from-[#1c091f]/90 to-[#120514]/90 border border-pink-500/30 hover:border-pink-400/80 rounded-3xl p-5 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer group hover:scale-[1.02] transition-all shadow-[0_4px_20px_rgba(244,114,182,0.12)] select-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-900/60 to-purple-900/40 border border-pink-500/40 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-md">
            🌌
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
              Future Bucket List
            </h3>
            <p className="text-xs text-pink-300/90 font-mono mt-0.5">
              Dreams &amp; Lanterns ✨
            </p>
          </div>
        </motion.div>

        {/* BENTO ITEM 4 (2x1): The Love Letter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          onClick={() => handleOpenSection('letter')}
          className="lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-[#2a0c28]/90 via-[#1e081c]/90 to-[#120412]/90 border border-pink-500/35 hover:border-pink-400 rounded-3xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-[0_0_25px_rgba(244,114,182,0.25)] transition-all select-none"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider text-pink-300 font-bold bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-500/30">
                💌 SEALED WITH LOVE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif-fancy font-bold text-white mb-1 group-hover:text-pink-200 transition-colors">
              The Birthday Love Letter
            </h3>
            <p className="text-xs sm:text-sm text-pink-100/75 max-w-[85%] leading-relaxed font-sans">
              An encrypted handwritten note with rose wax seal &amp; vintage typewriter melody.
            </p>

            <div className="mt-3.5 flex items-center gap-2">
              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-sm ${
                visitedSections.includes('letter') 
                  ? 'bg-pink-400 text-black' 
                  : 'bg-gradient-to-r from-amber-300 to-yellow-200 text-black font-extrabold'
              }`}>
                {visitedSections.includes('letter') ? '✓ UNSEALED' : 'UNSEAL LETTER'}
              </span>
              <span className="text-[11px] font-mono text-pink-200/80">
                {visitedSections.includes('letter') ? 'RECORDED IN HEART' : '+20 XP AVAILABLE'}
              </span>
            </div>
          </div>

          {/* Watermarked envelope in background */}
          <div className="absolute -right-2 -bottom-4 text-8xl sm:text-9xl opacity-15 rotate-12 pointer-events-none group-hover:opacity-25 group-hover:rotate-6 transition-all duration-300">
            💌
          </div>
        </motion.div>

        {/* BENTO ITEM 5 (1x1): Birmingham (UK) System Clock & Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="lg:col-span-1 lg:row-span-1 bg-[#140616]/90 border border-pink-500/30 rounded-3xl p-5 flex flex-col justify-between select-none shadow-[0_4px_20px_rgba(244,114,182,0.1)]"
        >
          <div className="text-[10px] uppercase tracking-wider text-pink-300 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>BIRMINGHAM UK</span>
            </span>
            <span className="text-[9px] bg-pink-950 px-1.5 py-0.5 rounded text-pink-300/80 border border-pink-500/20 font-mono">
              BST
            </span>
          </div>

          <div>
            <div className="font-mono text-2xl sm:text-3xl text-pink-200 font-black tracking-wider glow-text-pink">
              {birminghamTime || '00:00:00'}
            </div>
            <div className="text-[10px] text-pink-400/80 font-mono mt-0.5">
              20 AUGUST 2026
            </div>
          </div>

          <div className="text-[11px] font-mono text-amber-300 font-semibold flex items-center gap-1">
            <Heart className="w-3 h-3 fill-pink-500 text-pink-500 animate-pulse shrink-0" />
            <span className="truncate">
              {isTodayBirthday ? '🎉 TODAY IS LEVEL 23! 👑' : `Level 23 in: ${daysUntil}d`}
            </span>
          </div>
        </motion.div>

        {/* BENTO ITEM 6 (2x1): Birthday Surprise Vault */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          onClick={() => handleOpenSection('final-surprise', !isFinalUnlocked)}
          className={`lg:col-span-2 lg:row-span-1 rounded-3xl p-5 sm:p-6 flex items-center gap-4 select-none transition-all ${
            isFinalUnlocked
              ? 'bg-gradient-to-r from-[#2c0d28] via-[#200921] to-[#2c0d28] border-2 border-amber-300/80 shadow-[0_0_30px_rgba(251,191,36,0.35)] cursor-pointer hover:scale-[1.01]'
              : 'bg-[#0f0410]/70 border border-pink-900/40 opacity-65 cursor-not-allowed'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
            isFinalUnlocked 
              ? 'bg-gradient-to-tr from-amber-300 to-yellow-200 text-black shadow-lg animate-bounce' 
              : 'bg-[#1e0a1f] border border-pink-900/60'
          }`}>
            🎁
          </div>

          <div className="flex-grow min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-pink-300/80 font-mono flex items-center gap-1">
              <span>👑</span>
              <span>FINAL PROTOCOL</span>
            </div>
            <h3 className={`text-base sm:text-lg font-bold font-serif-fancy truncate ${
              isFinalUnlocked ? 'text-amber-200 glow-text-gold' : 'text-pink-100/60'
            }`}>
              Birthday Surprise Vault
            </h3>
            <p className="text-xs text-pink-200/70 truncate mt-0.5 font-sans">
              {isFinalUnlocked ? '✨ Ready to open! Tap to blow candles & claim gifts.' : `Requires ${syncRemaining} more XP to unlock.`}
            </p>
          </div>

          <div className="text-2xl shrink-0">
            {isFinalUnlocked ? '🔓' : '🔒'}
          </div>
        </motion.div>

        {/* BENTO ITEM 7 (1x1): Romantic Audio Equalizer */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="lg:col-span-1 lg:row-span-1 bg-[#130616]/90 border border-pink-500/30 rounded-3xl p-5 flex flex-col justify-between select-none shadow-[0_4px_20px_rgba(244,114,182,0.1)]"
        >
          {/* Animated Equalizer Bars */}
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-1.5 h-6">
              <div className={`w-1 bg-pink-400 rounded-t transition-all ${isPlaying ? 'h-3 animate-bounce' : 'h-1.5'}`} style={{ animationDuration: '0.6s' }} />
              <div className={`w-1 bg-rose-300 rounded-t transition-all ${isPlaying ? 'h-5 animate-bounce' : 'h-2'}`} style={{ animationDuration: '0.8s' }} />
              <div className={`w-1 bg-amber-300 rounded-t transition-all ${isPlaying ? 'h-4 animate-bounce' : 'h-1.5'}`} style={{ animationDuration: '0.7s' }} />
              <div className={`w-1 bg-pink-300 rounded-t transition-all ${isPlaying ? 'h-6 animate-bounce' : 'h-3'}`} style={{ animationDuration: '0.5s' }} />
            </div>

            {/* Play/Pause & Replay Button */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleTogglePlay}
                className="w-7 h-7 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 flex items-center justify-center cursor-pointer transition-colors"
                title={isPlaying ? "Pause Birthday Song" : "Play Birthday Song"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={handleRestartSong}
                className="w-7 h-7 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 flex items-center justify-center cursor-pointer transition-colors"
                title="Replay from Beginning"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-pink-300/80 font-mono">
              Now Playing
            </div>
            <div className="text-xs font-bold text-pink-100 truncate mt-0.5 font-sans">
              Happy Birthday to You 🎂👑
            </div>
          </div>
        </motion.div>

      </main>
      )}

      {/* Bento Footer Bar */}
      <footer className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t border-pink-500/20 text-[11px] text-pink-300/70 font-mono select-none">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5 text-pink-300">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span>DEVOTION: 100% INFINITE</span>
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span>💾</span>
            <span>XP AUTO-SAVED ({xp}/{targetXP})</span>
          </span>
          <span className="text-pink-400/80">🎀 LEVEL 23 PROTOCOL ACTIVE</span>
        </div>
        <div className="font-sans text-xs font-medium text-pink-200/80 flex items-center gap-1">
          <span>Crafted with endless love for Hanna by Afiq</span>
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 inline" />
        </div>
      </footer>
    </div>
  );
};
