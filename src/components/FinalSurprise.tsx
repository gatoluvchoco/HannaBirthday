import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { LoveCoupon } from '../types';
import { ArrowLeft, Sparkles, Heart, Crown, Gift, Check, Flame, Trophy, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalSurpriseProps {
  girlfriendName: string;
  yourName: string;
  finalMsg: string;
  finalSurpriseURL: string;
  coupons: LoveCoupon[];
  onBack: () => void;
  onRedeemCoupon: (id: string) => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  girlfriendName,
  yourName,
  finalMsg,
  finalSurpriseURL,
  coupons,
  onBack,
  onRedeemCoupon,
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [giftBoxOpened, setGiftBoxOpened] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  const defaultCoupons: LoveCoupon[] = [
    {
      id: 'coupon-1',
      title: '👑 Lifetime Princess Treatment',
      description: 'Redeemable forever: Breakfast in bed, carrying all bags, unlimited compliments, and full royal VIP status.',
      icon: '👑',
      redeemed: false,
    },
    {
      id: 'coupon-2',
      title: '🍽️ Luxury Romantic Dinner Date',
      description: 'Afiq takes Hanna to whatever aesthetic restaurant or cuisine she is craving—zero budget limits!',
      icon: '🥂',
      redeemed: false,
    },
    {
      id: 'coupon-3',
      title: '🛍️ Birthday Shopping Spree Voucher',
      description: 'A fun shopping trip where Hanna picks out cute outfits, makeup, or jewelry on Afiq.',
      icon: '🎀',
      redeemed: false,
    },
    {
      id: 'coupon-4',
      title: '💆 Cozy 60-Min Massage & Pamper',
      description: 'Relaxing back, shoulder, or foot massage with soothing scented oils & lo-fi playlist.',
      icon: '🌸',
      redeemed: false,
    },
    {
      id: 'coupon-5',
      title: '🧋 Infinite Iced Matchas & Sweet Treats',
      description: 'Whenever Hanna needs a sweet pick-me-up or boba craving, delivered directly with love.',
      icon: '🍓',
      redeemed: false,
    },
    {
      id: 'coupon-6',
      title: '🚗 Sunset Porsche Cruise & Late Night Drive',
      description: 'Singing along to our favorite songs with the windows down under the starry sky.',
      icon: '🏎️',
      redeemed: false,
    },
  ];

  const activeCoupons = coupons.length > 0 ? coupons : defaultCoupons;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fbbf24', '#fbcfe8', '#fda4af', '#4ade80', '#ffffff']
      });
    } catch {
      // fallback
    }
  };

  const handleBlowCandles = () => {
    sound.playCandleBlow();
    setCandlesLit(false);
    setWishMade(true);
    triggerConfetti();
    setTimeout(() => {
      sound.playLevelUp();
    }, 600);
  };

  const handleOpenGiftBox = () => {
    sound.playSparkle();
    setGiftBoxOpened(true);
    triggerConfetti();
  };

  const handleRedeem = (id: string) => {
    sound.playCoin();
    onRedeemCoupon(id);
    triggerConfetti();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 z-10">
      {/* Top Bar */}
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

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-400/20 border border-amber-300 text-amber-200 text-xs font-mono font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          <span>100 XP VAULT UNLOCKED</span>
        </div>
      </div>

      {/* Birthday Banner Bento Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8 bg-[#140616]/85 border border-pink-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_35px_rgba(244,114,182,0.2)]"
      >
        <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 shadow-sm">
          <span>👑</span>
          <span>LEVEL 23 CORONATION CEREMONY</span>
        </span>

        <h1 className="text-3xl sm:text-5xl font-serif-fancy font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 drop-shadow-md tracking-tight leading-tight">
          HAPPY 23RD BIRTHDAY {girlfriendName.toUpperCase()}!
        </h1>
        <p className="font-script text-2xl sm:text-3xl text-pink-300 mt-2 font-bold">
          To the most breathtaking girl in the entire universe ✨💖
        </p>
      </motion.div>

      {/* Birthday Cake Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#240a23]/90 via-[#170518]/90 to-[#0e0210]/90 border-2 border-pink-400/50 rounded-3xl p-6 sm:p-8 text-center mb-8 shadow-[0_0_40px_rgba(244,114,182,0.25)] relative overflow-hidden"
      >
        <h3 className="font-serif-fancy text-xl sm:text-2xl text-white font-bold mb-1">
          The Royal Birthday Cake 🎂
        </h3>
        <p className="text-xs sm:text-sm text-pink-200/80 font-sans mb-6 max-w-md mx-auto">
          {candlesLit 
            ? 'Make a secret birthday wish and blow out the candles!' 
            : '✨ Your wish is officially locked into the stars! Happy 23rd birthday! ✨'}
        </p>

        {/* 3-Tier Girly Pink Birthday Cake Graphic */}
        <div className="flex flex-col items-center justify-center my-6 select-none">
          {/* Candles */}
          <div className="flex items-center justify-center gap-4 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                {candlesLit ? (
                  <motion.div 
                    animate={{ scale: [1, 1.25, 0.95, 1], y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 + i * 0.1 }}
                    className="w-3.5 h-5 bg-gradient-to-t from-orange-400 via-yellow-300 to-white rounded-full shadow-[0_0_12px_#fbbf24]"
                  />
                ) : (
                  <div className="w-1.5 h-3 bg-stone-500 rounded-t opacity-40" />
                )}
                <div className="w-2 h-6 bg-gradient-to-b from-pink-200 to-rose-400 rounded-t shadow-sm" />
              </div>
            ))}
          </div>

          {/* Tier 1 (Top) */}
          <div className="w-36 h-10 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-2xl border border-pink-400 flex items-center justify-center text-xs font-mono font-bold text-pink-900 shadow-md">
            💖 LEVEL 23 (23 YEARS) 💖
          </div>

          {/* Tier 2 (Middle) */}
          <div className="w-52 h-12 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-2xl border border-pink-400 flex items-center justify-center text-xs font-mono font-bold text-pink-950 shadow-md mt-0.5">
            🍓 STRAWBERRY CREME 🍓
          </div>

          {/* Tier 3 (Base) */}
          <div className="w-68 h-14 bg-gradient-to-r from-[#e879f9] via-pink-400 to-[#e879f9] rounded-2xl border border-pink-300 flex items-center justify-center text-xs font-mono font-bold text-pink-950 shadow-lg mt-0.5">
            👑 FOR PRINCESS HANNA 👑
          </div>

          {/* Cake Stand */}
          <div className="w-76 h-3 bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-300 rounded-full shadow-md mt-1" />
        </div>

        {/* Blow Candle Button */}
        {candlesLit ? (
          <button
            onClick={handleBlowCandles}
            className="px-8 py-3.5 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-serif-fancy font-black text-sm rounded-2xl shadow-[0_0_25px_rgba(244,114,182,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2 mx-auto"
          >
            <Flame className="w-4 h-4 text-orange-600 fill-orange-600" />
            <span>MAKE A WISH &amp; BLOW CANDLES</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-pink-950/80 border border-pink-400 text-pink-200 font-mono text-xs font-bold shadow-[0_0_15px_rgba(244,114,182,0.3)]">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>WISH LOCKED IN! MAY ALL YOUR DREAMS COME TRUE 💖</span>
          </div>
        )}
      </motion.div>

      {/* Interactive Birthday Gift Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1d081f]/90 to-[#120313]/90 border border-pink-500/30 rounded-3xl p-6 sm:p-8 mb-8 text-center shadow-lg"
      >
        <h3 className="font-serif-fancy text-xl sm:text-2xl text-white font-bold mb-2">
          Special Birthday Present from Afiq 🎁
        </h3>
        <p className="text-xs sm:text-sm text-pink-200/80 mb-6 max-w-md mx-auto">
          Tap the wrapped luxury gift box with golden ribbon to unbox your special keepsake!
        </p>

        {!giftBoxOpened ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenGiftBox}
            className="w-36 h-36 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-200 flex flex-col items-center justify-center text-5xl shadow-[0_0_35px_rgba(244,114,182,0.5)] cursor-pointer relative border-2 border-white"
          >
            <Gift className="w-16 h-16 text-[#1f051c] animate-bounce" />
            <span className="text-[10px] font-mono font-black text-black uppercase mt-1">
              TAP TO UNBOX
            </span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg mx-auto bg-[#240827] border-2 border-pink-400 rounded-3xl p-6 shadow-2xl"
          >
            <div className="text-4xl mb-2">💎 💖 🏎️</div>
            <h4 className="font-serif-fancy text-lg sm:text-xl font-bold text-amber-200 mb-2">
              Afiq&apos;s Lifetime Love Promise
            </h4>
            <p className="text-xs sm:text-sm text-pink-100 leading-relaxed mb-5 font-sans whitespace-pre-wrap">
              {finalMsg}
            </p>

            <a
              href={finalSurpriseURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-serif-fancy font-black text-xs rounded-2xl shadow-lg hover:brightness-110 transition-all uppercase tracking-wider"
            >
              <span>ACCESS PHOTO &amp; GIFT VAULT</span>
              <Sparkles className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        )}
      </motion.div>

      {/* Redeemable Love Coupons Bento Grid */}
      <div className="bg-[#120614]/85 border border-pink-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-pink-300 font-bold bg-pink-950 px-2 py-0.5 rounded-full border border-pink-500/30">
              👑 VIP ROYAL PRIVILEGES
            </span>
            <h3 className="font-serif-fancy text-xl sm:text-2xl text-white font-bold mt-1">
              Hanna&apos;s Level 23 Birthday Coupons
            </h3>
          </div>
          <span className="text-xs font-mono text-pink-400 font-bold">
            {activeCoupons.filter(c => c.redeemed).length} / {activeCoupons.length} REDEEMED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                coupon.redeemed
                  ? 'bg-pink-950/40 border-pink-900/50 opacity-60'
                  : 'bg-gradient-to-br from-[#200922] to-[#140516] border-pink-500/40 hover:border-pink-300 hover:shadow-[0_0_20px_rgba(244,114,182,0.2)]'
              }`}
            >
              <div>
                <div className="text-2xl mb-2">{coupon.icon}</div>
                <h4 className="font-serif-fancy font-bold text-sm text-pink-100 mb-1">
                  {coupon.title}
                </h4>
                <p className="text-xs text-pink-200/75 leading-relaxed font-sans">
                  {coupon.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-500/20 flex items-center justify-between">
                <span className="text-[10px] font-mono text-pink-400">
                  {coupon.redeemed ? 'STATUS: REDEEMED' : 'UNLIMITED VALIDITY'}
                </span>
                <button
                  disabled={coupon.redeemed}
                  onClick={() => handleRedeem(coupon.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    coupon.redeemed
                      ? 'bg-pink-900/40 text-pink-400/60 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-400 to-rose-300 text-black hover:brightness-110 shadow-sm'
                  }`}
                >
                  {coupon.redeemed ? '✓ REDEEMED' : 'REDEEM NOW'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
