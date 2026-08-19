import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';
import { ArrowLeft, Sparkles, Heart, RotateCcw } from 'lucide-react';

interface LoveLetterProps {
  girlfriendName: string;
  yourName: string;
  letterMsg: string;
  onBack: () => void;
  onUpdateLetter?: (newMsg: string) => void;
  onGainXP: (amount: number) => void;
  isLetterOpened: boolean;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({
  girlfriendName,
  yourName,
  letterMsg,
  onBack,
  onGainXP,
  isLetterOpened,
}) => {
  const [isOpen, setIsOpen] = useState(isLetterOpened);

  const defaultLetter = `My dearest ${girlfriendName},\n\nHappy 23rd Birthday, my love! 👑💖\n\nTurning 23 is such a special milestone, and I feel so incredibly grateful to celebrate this day with you. From the first time we talked to all the late-night laughs, silly jokes, and quiet moments where we don't even need words—you've brought so much warmth, comfort, and pure happiness into my life.\n\nYou have this radiant energy that lights up everywhere you go, and your smile is still my absolute favourite thing in the entire world.\n\nAs you step into Level 23, I promise to always cheer for your dreams, hold your hand through every adventure, buy you your favourite iced matcha and sweet treats, and love you more and more every single day.\n\nHappy Birthday, my princess. Here's to us, today and forever.\n\nForever & always yours,\n${yourName} 🌹✨`;

  const currentMessage = letterMsg || defaultLetter;

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      sound.playSparkle();
      sound.playTypewriter();
      setIsOpen(true);
      onGainXP(20);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 z-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1c081e] border border-pink-500/40 text-pink-200 text-xs font-mono hover:bg-[#2e0e31] transition-all cursor-pointer shadow-[0_0_15px_rgba(244,114,182,0.15)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SANCTUARY</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-pink-300/80 bg-[#1c081e]/80 px-3 py-1.5 rounded-2xl border border-pink-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>FROM AFIQ WITH LOVE 💖</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6 bg-[#140616]/85 border border-pink-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-[0_8px_30px_rgba(244,114,182,0.15)]">
        <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider mb-2 shadow-sm">
          <span>💌</span>
          <span>CONFIDENTIAL // FOR PRINCESS {girlfriendName.toUpperCase()}</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif-fancy font-black text-white">
          THE BIRTHDAY LOVE LETTER
        </h2>
        <p className="text-xs sm:text-sm font-sans text-pink-100/75 mt-1.5 max-w-lg mx-auto">
          {isOpen ? 'Written straight from Afiq\'s heart for your 23rd milestone.' : 'Tap the wax-sealed rose gold envelope to unfold.'}
        </p>
      </div>

      {/* Letter / Envelope View */}
      <div className="flex flex-col items-center">
        {!isOpen ? (
          /* Sealed Envelope */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            onClick={handleOpenEnvelope}
            className="w-full max-w-md bg-gradient-to-br from-[#2a0b27] via-[#1f071e] to-[#120314] border-2 border-pink-400/60 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(244,114,182,0.35)] cursor-pointer text-center relative overflow-hidden group select-none"
          >
            {/* Ambient shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-amber-400/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Golden Wax Seal Stamp */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 border-4 border-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.6)] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🌹
              </div>

              <span className="text-[11px] uppercase tracking-widest text-pink-300 font-mono font-bold mb-1">
                PAR AVION &bull; PRIVATE CONFIDENTIAL
              </span>

              <h3 className="font-serif-fancy text-xl sm:text-2xl text-white font-bold mb-2">
                For My Princess {girlfriendName} 👑
              </h3>

              <p className="text-xs text-pink-200/80 font-sans max-w-xs mb-6">
                A special hand-crafted letter celebrating your 23rd birthday milestone.
              </p>

              <div className="px-5 py-2.5 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] text-xs font-bold font-serif-fancy rounded-full shadow-lg flex items-center gap-2 group-hover:brightness-110 transition-all">
                <span>TAP TO BREAK WAX SEAL (+20 XP)</span>
                <Heart className="w-3.5 h-3.5 fill-current text-rose-600" />
              </div>
            </div>
          </motion.div>
        ) : (
          /* Unfolded Parchment Letter */
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-[#fdfaf5] text-[#2c1810] border-4 border-[#e6cca8] rounded-3xl p-6 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Subtle vintage parchment watermark & border accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-300 via-amber-200 to-rose-300 opacity-60" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

            {/* Elegant Letterhead Header */}
            <div className="flex items-center justify-between border-b border-[#d8be9a] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌹</span>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#8a6850] block font-bold">
                    ROYAL PROCLAMATION &bull; LEVEL 23
                  </span>
                  <span className="font-serif-fancy font-bold text-[#3d2314] text-base sm:text-lg">
                    FROM AFIQ WITH ALL MY HEART
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-editorial italic text-lg sm:text-xl text-[#7c2d12] font-semibold">
                  20 August 2026
                </div>
                <div className="text-[10px] font-mono text-[#8a6850]">
                  BIRMINGHAM &bull; MALAYSIA
                </div>
              </div>
            </div>

            {/* Letter Body Text (Romantic, Elegant, and High Legibility) */}
            <div className="font-editorial text-xl sm:text-2xl md:text-[26px] text-[#241209] font-normal leading-relaxed sm:leading-[1.8] whitespace-pre-line select-text tracking-wide">
              {currentMessage}
            </div>

            {/* Bottom Signature & Stamp */}
            <div className="mt-10 pt-6 border-t border-[#d8be9a] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#991b1b] to-[#b91c1c] text-[#fef08a] border-2 border-amber-300 flex items-center justify-center font-serif-fancy font-black text-sm shadow-md">
                  A &amp; H
                </div>
                <div className="text-left">
                  <div className="text-xs font-serif-fancy font-bold text-[#3d2314]">
                    FOREVER SEALED &amp; PROMISED
                  </div>
                  <div className="text-[10px] font-mono text-[#8a6850]">
                    HEART ENCRYPTED: 100%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#f0dfc8] hover:bg-[#e4ceb2] text-[#4a2e1b] font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fold Letter</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
