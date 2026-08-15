import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Monitor, Settings, Crown, Sparkles, Heart, Clock, Save, Check } from 'lucide-react';

interface HeaderHUDProps {
  playerName: string;
  level: number;
  xp: number;
  targetXP: number;
  isMuted: boolean;
  onToggleMute: () => void;
  crtEnabled: boolean;
  onToggleCRT: () => void;
  onOpenSettings: () => void;
  onTriggerEasterEgg: () => void;
  onManualSave?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  playerName,
  level,
  xp,
  targetXP,
  isMuted,
  onToggleMute,
  crtEnabled,
  onToggleCRT,
  onOpenSettings,
  onTriggerEasterEgg,
  onManualSave,
}) => {
  const [avatarClicks, setAvatarClicks] = useState(0);
  const [birminghamTime, setBirminghamTime] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const xpPercent = Math.min(100, Math.floor((xp / targetXP) * 100));

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setBirminghamTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAvatarClick = () => {
    sound.playHeartCatch();
    const next = avatarClicks + 1;
    setAvatarClicks(next);
    if (next >= 5) {
      setAvatarClicks(0);
      onTriggerEasterEgg();
    }
  };

  const handleToggleSound = () => {
    sound.playClick();
    onToggleMute();
  };

  const handleSaveClick = () => {
    sound.playSparkle();
    if (onManualSave) {
      onManualSave();
    }
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
    }, 2000);
  };

  return (
    <header className="w-full max-w-5xl mx-auto mb-5 px-3 sm:px-6">
      <div className="bg-[#120713]/85 border border-pink-500/30 hover:border-pink-400/50 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(244,114,182,0.15)] flex flex-col gap-3 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Princess Avatar & Identification */}
          <div 
            onClick={handleAvatarClick}
            className="flex items-center gap-3.5 cursor-pointer select-none group"
            title="Click 5 times for a secret princess surprise! 🎀"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-950 via-[#2a0d24] to-[#1a0826] border-2 border-pink-400/60 flex items-center justify-center text-2xl group-hover:scale-105 group-hover:border-pink-300 transition-all shadow-[0_0_15px_rgba(244,114,182,0.35)]">
                👑
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-tr from-amber-300 to-yellow-200 rounded-full border border-black/80 flex items-center justify-center text-[9px] font-bold text-black animate-bounce shadow-md">
                ✨
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-pink-300 font-bold bg-pink-950/60 border border-pink-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>🎀</span>
                  <span>HER ROYAL HIGHNESS</span>
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-pink-950/80 border border-pink-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-amber-300" />
                  <span>BHAM: {birminghamTime || '00:00'}</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight flex items-center gap-2 mt-0.5">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 font-serif-fancy">
                  {playerName.toUpperCase()}
                </span>
                <span className="text-pink-400 text-xs sm:text-sm font-mono font-bold px-2 py-0.5 rounded-xl bg-pink-950/80 border border-pink-400/40 shadow-sm">
                  LVL {level} QUEEN
                </span>
              </h1>
            </div>
          </div>

          {/* XP Synchronization & Controls */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full">
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-pink-200/70 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>DIAMOND SYNC:</span>
                </span>
                <span className="font-bold text-amber-300">
                  {xp} / {targetXP} XP
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-emerald-400/90 font-mono bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AUTO-SAVED</span>
                </span>
                {xp >= targetXP && (
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-200 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shadow-[0_0_10px_rgba(251,191,36,0.6)] flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" />
                    UNLOCKED
                  </span>
                )}
              </div>

              {/* Fancy Glass Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Save Progress Button */}
                <button
                  onClick={handleSaveClick}
                  className={`px-2.5 py-1.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-1 text-[11px] font-mono font-bold ${
                    justSaved
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)] scale-105'
                      : 'bg-pink-950/70 border-pink-500/40 text-pink-200 hover:bg-pink-900 hover:border-pink-300'
                  }`}
                  title="Save your current XP and progress before quitting"
                >
                  {justSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SAVED!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-pink-400" />
                      <span className="hidden sm:inline">SAVE XP</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleSound}
                  className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                    isMuted
                      ? 'bg-pink-950/60 border-pink-800 text-pink-400'
                      : 'bg-pink-900/60 border-pink-400/60 text-pink-200 shadow-[0_0_12px_rgba(244,114,182,0.3)]'
                  }`}
                  title={isMuted ? 'Unmute Audio & Music' : 'Mute Sound'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={onToggleCRT}
                  className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                    crtEnabled
                      ? 'bg-amber-900/60 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                      : 'bg-pink-950/60 border-pink-500/30 text-pink-300 hover:border-pink-400'
                  }`}
                  title="Toggle Retro Scanline / CRT Shader"
                >
                  <Monitor className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenSettings}
                  className="p-2 rounded-2xl bg-pink-950/60 border border-pink-500/30 text-pink-300 hover:text-white hover:border-pink-400 transition-all cursor-pointer"
                  title="Config & Developer Studio"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Micro XP Progress Indicator */}
            <div className="w-full sm:w-56 h-2 bg-[#0a030b] rounded-full border border-pink-500/30 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-rose-300 to-amber-300 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(244,114,182,0.8)]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

