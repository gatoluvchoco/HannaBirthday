import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  getTimezoneCountdown, 
  TimezoneStatus 
} from '../utils/timeZone';
import { 
  Lock, 
  Unlock, 
  Sparkles, 
  Heart, 
  Clock, 
  Mail, 
  Music, 
  Volume2, 
  VolumeX, 
  Crown, 
  Flame, 
  KeyRound, 
  Send,
  Eye
} from 'lucide-react';

interface BirminghamBirthdayLockProps {
  girlfriendName: string;
  yourName: string;
  level: number;
  onUnlockSuccess: () => void;
  isBypassed?: boolean;
}

export const BirminghamBirthdayLock: React.FC<BirminghamBirthdayLockProps> = ({
  girlfriendName,
  yourName,
  level,
  onUnlockSuccess,
  isBypassed = false,
}) => {
  const [timeStatus, setTimeStatus] = useState<TimezoneStatus>(getTimezoneCountdown());
  const [heartPings, setHeartPings] = useState(0);
  const [activeTeaserIndex, setActiveTeaserIndex] = useState<number | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<Array<{ id: number; x: number; y: number; text: string }>>([]);

  const birthdayTeasers = [
    {
      title: "Teaser #1: Retro Arcade Arena 🎮",
      detail: `${yourName} built 5 custom mini-games for you: Princess Match, Whack-a-Heart, Memory Capsule, Love Trivia & Heart Catcher!`,
      tag: "MINI-GAMES",
      icon: "🕹️"
    },
    {
      title: "Teaser #2: Our Photo Timeline 📸",
      detail: "All our precious memories, the Blond Sweater, Roblox late-night dates, laptop video calls, and Level 23 milestones are waiting for you!",
      tag: "REAL MEMORIES",
      icon: "🎀"
    },
    {
      title: "Teaser #3: 3-Tier Birthday Cake & Candles 🎂",
      detail: "A private birthday cake with real wish-blowing candles locked in the Level 23 Coronation Vault!",
      tag: "GRAND FINALE",
      icon: "👑"
    },
    {
      title: "Teaser #4: Royal Love Letter 💌",
      detail: `A heartfelt letter written from ${yourName}'s soul directly to you on your 23rd birthday.`,
      tag: "FOR HANNA",
      icon: "💖"
    },
    {
      title: "Teaser #5: VIP Love Coupons 🏎️",
      detail: "Never-expiring vouchers: Lifetime Princess Treatment, Sunset Porsche road trip, luxury romantic dinners, and infinite iced matchas!",
      tag: "LIFETIME REWARDS",
      icon: "🎟️"
    },
    {
      title: "Teaser #6: Birmingham to Keningau Distance 🌍",
      detail: "Even with 7,000+ miles between Birmingham (BST) and Keningau, Sabah (MYT), every heartbeat bridges the distance directly to you.",
      tag: "ETERNAL LOVE",
      icon: "✨"
    }
  ];

  // Auto-play Godspeed by Frank Ocean on mount
  useEffect(() => {
    sound.playGodspeed();
    setIsMusicPlaying(sound.isPlayingBGM());

    // Autoplay fallback for mobile/browsers requiring first gesture
    const handleFirstGesture = () => {
      sound.resumeContext();
      if (!sound.isPlayingBGM()) {
        sound.playGodspeed();
      }
      setIsMusicPlaying(sound.isPlayingBGM());
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = getTimezoneCountdown();
      setTimeStatus(updated);

      if (updated.isUnlocked && !timeStatus.isUnlocked) {
        handleTriggerMidnightFanfare();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTriggerMidnightFanfare = () => {
    sound.playLevelUp();
    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f472b6', '#fbbf24', '#fbcfe8', '#fda4af', '#a855f7', '#ffffff']
      });
    } catch {
      // ignore
    }
  };

  const handleSendHeartPing = () => {
    sound.playHeartCatch();
    setHeartPings(prev => prev + 1);

    const emojis = ['💖', '💌', '🌸', '✨', '👑', '🍓', '🏎️'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const particleId = Date.now() + Math.random();

    setFloatingParticles(prev => [
      ...prev.slice(-8),
      {
        id: particleId,
        x: Math.random() * 80 + 10,
        y: Math.random() * 30 + 50,
        text: randomEmoji
      }
    ]);

    setTimeout(() => {
      setFloatingParticles(prev => prev.filter(p => p.id !== particleId));
    }, 1500);
  };

  const handleToggleMusic = () => {
    sound.playClick();
    if (!isMusicPlaying) {
      sound.startBGM(0);
      setIsMusicPlaying(true);
    } else {
      sound.stopBGM();
      setIsMusicPlaying(false);
    }
  };

  const handleOpenTeaser = (idx: number) => {
    sound.playSparkle();
    setActiveTeaserIndex(idx);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f472b6', '#fbbf24', '#fbcfe8']
      });
    } catch {
      // ignore
    }
  };

  const handleAfiqBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcodeInput.trim();
    // Unlock with password 0137335130
    if (clean === '0137335130' || clean.toLowerCase() === '23') {
      sound.playLevelUp();
      onUnlockSuccess();
    } else {
      sound.playPop();
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 2500);
    }
  };

  const isActuallyUnlocked = timeStatus.isUnlocked || isBypassed;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 z-20 relative select-none">
      {/* Floating Animated Heart Particles */}
      {floatingParticles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: 0, scale: 0.8, x: `${p.x}vw` }}
          animate={{ opacity: 0, y: -160, scale: 1.6 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="fixed pointer-events-none text-2xl sm:text-3xl z-50 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]"
          style={{ left: 0, bottom: `${p.y}vh` }}
        >
          {p.text}
        </motion.div>
      ))}

      {/* Main Lock Screen Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-gradient-to-b from-[#18061a]/95 via-[#120414]/95 to-[#09020a]/95 border-2 border-pink-500/50 rounded-3xl p-5 sm:p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(244,114,182,0.35)] relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar: Timezone Live HUD & Music Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-500/25 pb-4 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500" />
            </span>
            <span className="font-mono text-xs text-pink-300 font-bold tracking-wider">
              BIRMINGHAM BIRTHDAY GATEWAY // 20 AUGUST
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Music Jukebox Toggle */}
            <button
              onClick={handleToggleMusic}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono border transition-all cursor-pointer ${
                isMusicPlaying 
                  ? 'bg-pink-500/30 text-pink-200 border-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.4)]' 
                  : 'bg-black/40 text-pink-300/70 border-pink-800/40 hover:text-pink-200'
              }`}
              title="Play Frank Ocean - Godspeed"
            >
              {isMusicPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isMusicPlaying ? 'GODSPEED - FRANK OCEAN 🎵' : 'PLAY GODSPEED 🎵'}</span>
            </button>
          </div>
        </div>

        {/* Dual Live Clocks Widget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 relative z-10">
          {/* Birmingham Clock (Hanna's Location) */}
          <div className="bg-[#1e0721]/90 border border-pink-500/40 rounded-2xl p-3.5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="flex items-center gap-1.5 text-pink-200 font-bold">
                <span>🇬🇧</span>
                <span>BIRMINGHAM, UK (HANNA)</span>
              </span>
              <span className="text-[10px] text-pink-400 bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-800/40">
                BST (UTC+1)
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-white my-0.5 tracking-tight flex items-center justify-between">
              <span>{timeStatus.birminghamTimeStr}</span>
              <Clock className="w-4 h-4 text-pink-400" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-sans text-pink-300/80 pt-1 border-t border-pink-500/20">
              <span>{timeStatus.birminghamDateStr}</span>
              <span className="font-mono text-amber-300 font-bold">
                {isActuallyUnlocked ? '🔓 BIRTHDAY UNLOCKED' : '🔒 UNLOCKS AT 12:00 AM'}
              </span>
            </div>
          </div>

          {/* Keningau Clock (Afiq's Location) */}
          <div className="bg-[#140618]/90 border border-purple-500/30 rounded-2xl p-3.5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="flex items-center gap-1.5 text-purple-200 font-bold">
                <span>🇲🇾</span>
                <span>KENINGAU (AFIQ)</span>
              </span>
              <span className="text-[10px] text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/40">
                MYT (UTC+8)
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-white my-0.5 tracking-tight flex items-center justify-between">
              <span>{timeStatus.malaysiaTimeStr}</span>
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-sans text-purple-200/80 pt-1 border-t border-purple-500/20">
              <span>{timeStatus.malaysiaDateStr}</span>
              <span className="font-mono text-emerald-300 font-bold">
                ✓ OPEN ON MYT TIME
              </span>
            </div>
          </div>
        </div>

        {/* Central Crown & Heading */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/50 text-xs font-mono font-bold text-pink-200 mb-3 shadow-inner">
            <Crown className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>FOR PRINCESS {girlfriendName.toUpperCase()} &bull; LEVEL {level}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif-fancy font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 drop-shadow leading-tight">
            {isActuallyUnlocked 
              ? `IT'S 12:00 AM IN BIRMINGHAM! HAPPY 23RD BIRTHDAY! 🎂👑` 
              : `ITS LOCKED HEHE :)`}
          </h1>

          <p className="text-xs sm:text-sm font-sans text-pink-200/80 max-w-md mx-auto mt-2 leading-relaxed">
            {isActuallyUnlocked
              ? "The stars have aligned! Your Level 23 Coronation Sanctuary is now open. Step inside to celebrate with Afiq! ✨"
              : `Your personalized birthday sanctuary unlocks precisely when the clock strikes midnight (12:00 AM) in Birmingham, UK!`}
          </p>
        </div>

        {/* Countdown Timer Block (If Locked) */}
        {!isActuallyUnlocked && (
          <div className="mb-6 relative z-10">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
              {/* Days */}
              <div className="bg-[#200824] border-2 border-pink-500/50 rounded-2xl p-2.5 sm:p-3 text-center shadow-[0_0_20px_rgba(244,114,182,0.2)]">
                <div className="text-2xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200">
                  {String(timeStatus.days).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-pink-300 font-bold uppercase mt-1">
                  DAYS
                </div>
              </div>

              {/* Hours */}
              <div className="bg-[#200824] border-2 border-pink-500/50 rounded-2xl p-2.5 sm:p-3 text-center shadow-[0_0_20px_rgba(244,114,182,0.2)]">
                <div className="text-2xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200">
                  {String(timeStatus.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-pink-300 font-bold uppercase mt-1">
                  HOURS
                </div>
              </div>

              {/* Minutes */}
              <div className="bg-[#200824] border-2 border-pink-500/50 rounded-2xl p-2.5 sm:p-3 text-center shadow-[0_0_20px_rgba(244,114,182,0.2)]">
                <div className="text-2xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200">
                  {String(timeStatus.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-pink-300 font-bold uppercase mt-1">
                  MINUTES
                </div>
              </div>

              {/* Seconds */}
              <div className="bg-[#2a0a2f] border-2 border-amber-400/60 rounded-2xl p-2.5 sm:p-3 text-center shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                <div className="text-2xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-yellow-400">
                  {String(timeStatus.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1">
                  SECONDS
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <span className="text-[11px] font-mono text-pink-300/80 bg-black/40 px-3 py-1 rounded-full border border-pink-900/50 inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Target: 20 August 00:00:00 BST &bull; Birmingham UK</span>
              </span>
            </div>

            {/* Direct Password Unlock Form */}
            <div className="mt-4 max-w-md mx-auto bg-gradient-to-r from-[#220726] via-[#1a051c] to-[#220726] border border-pink-500/40 rounded-2xl p-3.5 shadow-md">
              <div className="text-[11px] font-mono text-pink-200 font-bold mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>VIP PASSWORD UNLOCK</span>
              </div>
              <form onSubmit={handleAfiqBypassSubmit} className="flex gap-2">
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter secret password..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/70 border border-pink-500/40 text-pink-100 text-xs font-mono focus:outline-none focus:border-amber-300 placeholder:text-pink-300/40"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-serif-fancy font-black text-xs rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1 uppercase"
                >
                  <Unlock className="w-3.5 h-3.5 text-black" />
                  <span>UNLOCK</span>
                </button>
              </form>
              {passcodeError && (
                <div className="text-[11px] text-rose-400 font-mono mt-1.5 text-center animate-pulse">
                  Incorrect password! Try again.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enter Sanctuary Button (When Unlocked) */}
        {isActuallyUnlocked && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-6 relative z-10"
          >
            <button
              onClick={() => {
                sound.playLevelUp();
                sound.startBGM(0);
                onUnlockSuccess();
              }}
              className="w-full max-w-md py-4 px-8 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-serif-fancy font-black text-base sm:text-lg rounded-2xl shadow-[0_0_40px_rgba(244,114,182,0.8)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto"
            >
              <Crown className="w-6 h-6 text-[#1f051c]" />
              <span>ENTER YOUR 23RD BIRTHDAY SANCTUARY 👑</span>
              <Sparkles className="w-5 h-5 text-[#1f051c]" />
            </button>
          </motion.div>
        )}

        {/* Interactive Waiting Activities & Teasers Section */}
        <div className="bg-[#170519]/85 border border-pink-500/30 rounded-2xl p-4 sm:p-5 mb-5 relative z-10 shadow-inner">
          <div className="flex items-center justify-between mb-3 border-b border-pink-500/20 pb-2">
            <span className="text-xs font-mono font-bold text-pink-200 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-pink-400" />
              <span>AFIQ&apos;S BIRTHDAY TEASERS &amp; CLUES</span>
            </span>
            <span className="text-[10px] font-mono text-pink-400">
              TAP TO PEEK 💌
            </span>
          </div>

          {/* Teaser Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {birthdayTeasers.map((teaser, idx) => (
              <button
                key={idx}
                onClick={() => handleOpenTeaser(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  activeTeaserIndex === idx
                    ? 'bg-gradient-to-br from-pink-500/30 to-purple-600/30 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.3)]'
                    : 'bg-black/40 border-pink-900/40 hover:border-pink-500/50 hover:bg-pink-950/30'
                }`}
              >
                <div className="text-xl mb-1">{teaser.icon}</div>
                <div className="text-[11px] font-serif-fancy font-bold text-pink-100 truncate">
                  {teaser.title.split(':')[0]}
                </div>
                <span className="text-[9px] font-mono text-pink-300/70 uppercase">
                  {teaser.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Active Teaser Card View */}
          <AnimatePresence mode="wait">
            {activeTeaserIndex !== null && (
              <motion.div
                key={activeTeaserIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#240828] border-2 border-pink-400/60 rounded-2xl p-4 text-center shadow-lg relative"
              >
                <div className="text-3xl mb-1">{birthdayTeasers[activeTeaserIndex].icon}</div>
                <h3 className="text-sm font-serif-fancy font-bold text-amber-200 mb-1">
                  {birthdayTeasers[activeTeaserIndex].title}
                </h3>
                <p className="text-xs font-sans text-pink-100 leading-relaxed max-w-lg mx-auto">
                  {birthdayTeasers[activeTeaserIndex].detail}
                </p>
                <div className="mt-2 text-[10px] font-mono text-pink-300">
                  💌 Prepared with love by Afiq for Hanna
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Heart Ping Button to Afiq */}
          <div className="mt-4 pt-3 border-t border-pink-500/20 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-sans text-pink-200">
              <span>Send love waves to Keningau: </span>
              <strong className="text-amber-300 font-mono font-bold">{heartPings}</strong>
              <span className="text-pink-300 text-[11px] ml-1">hearts dispatched!</span>
            </div>

            <button
              onClick={handleSendHeartPing}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-mono text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>SEND HEART PING 💖</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-center text-center gap-2 text-[11px] font-mono text-pink-300/60 pt-2 border-t border-pink-900/40 relative z-10">
          <span>Crafted with love for Hanna by Afiq &bull; Birmingham BST Protocol</span>
        </div>
      </motion.div>
    </div>
  );
};
