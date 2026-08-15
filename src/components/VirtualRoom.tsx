import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { ArrowLeft, Sparkles, Heart, Crown, Compass, X } from 'lucide-react';

interface VirtualRoomProps {
  girlfriendName: string;
  interactedObjects?: string[];
  onBack: () => void;
  onGainXP: (amount: number, objectId?: string) => void;
}

interface RoomObject {
  id: string;
  name: string;
  icon: string;
  x: number; // percentage
  y: number; // percentage
  dialog: string;
  soundType: 'car' | 'sparkle' | 'heart' | 'typewriter' | 'pop';
  tag: string;
}

export const VirtualRoom: React.FC<VirtualRoomProps> = ({
  girlfriendName,
  interactedObjects = [],
  onBack,
  onGainXP,
}) => {
  const [selectedObj, setSelectedObj] = useState<RoomObject | null>(null);
  const [localInteracted, setLocalInteracted] = useState<string[]>(interactedObjects);

  const allInteracted = Array.from(new Set([...interactedObjects, ...localInteracted]));

  const roomObjects: RoomObject[] = [
    {
      id: 'porsche',
      name: 'Rose-Gold Metallic Porsche GT3 RS',
      icon: '🏎️',
      x: 18,
      y: 72,
      dialog: "VROOOOM! 🏎️💨 Hanna's dream Porsche GT3 RS custom-wrapped in metallic rose-gold & pearl finish. Ready for endless sunset drives together!",
      soundType: 'car',
      tag: 'DREAM RIDE 👑'
    },
    {
      id: 'teddy',
      name: 'Giant Teddy Bear with Silk Ribbon',
      icon: '🧸',
      x: 78,
      y: 68,
      dialog: "A massive, ultra-soft plushie bear holding a card that reads: 'Whenever Afiq isn't around, hug this bear tight!' 🎀💖",
      soundType: 'heart',
      tag: 'ENDLESS HUGS'
    },
    {
      id: 'vanity',
      name: 'Royal Vanity & French Perfume',
      icon: '💄',
      x: 82,
      y: 30,
      dialog: "Hanna's perfume collection (Miss Dior & Peony Starlight) and vanity lights. The mirror reflects the prettiest girl in the world! ✨🌸",
      soundType: 'sparkle',
      tag: 'SIGNATURE SCENT'
    },
    {
      id: 'tiara',
      name: 'Diamond Tiara & Velvet Box',
      icon: '👑',
      x: 50,
      y: 24,
      dialog: "A sparkling diamond tiara crafted specifically for Hanna's Level 23 birthday coronation. You will always be my queen! 💎👸",
      soundType: 'sparkle',
      tag: 'LEVEL 23 QUEEN'
    },
    {
      id: 'champagne',
      name: 'Champagne & Chocolate Strawberries',
      icon: '🥂',
      x: 28,
      y: 35,
      dialog: "A chilled glass of sparkling champagne paired with fresh gourmet strawberries. Cheers to your 23rd birthday, beautiful! 🍓🥂✨",
      soundType: 'pop',
      tag: 'BIRTHDAY TOAST'
    },
    {
      id: 'music-box',
      name: 'Crystal Music Box',
      icon: '🎵',
      x: 48,
      y: 74,
      dialog: "A delicate crystal music box playing 'Happy Birthday Hanna' with warm retro chiptune bells! 🎂🎶💖",
      soundType: 'sparkle',
      tag: 'HAPPY BIRTHDAY MELODY'
    }
  ];

  const handleObjectClick = (obj: RoomObject) => {
    switch (obj.soundType) {
      case 'car':
        sound.playCarRev();
        break;
      case 'heart':
        sound.playHeartCatch();
        break;
      case 'sparkle':
        sound.playSparkle();
        break;
      case 'pop':
        sound.playPop();
        break;
      default:
        sound.playCoin();
    }

    setSelectedObj(obj);

    if (!allInteracted.includes(obj.id)) {
      setLocalInteracted(prev => [...prev, obj.id]);
      onGainXP(10, obj.id);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-3 z-10">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
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

        <div className="flex items-center gap-2 text-xs font-mono text-pink-300 bg-pink-950/80 px-3.5 py-1.5 rounded-2xl border border-pink-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>KEEPSAKES: {allInteracted.length} / {roomObjects.length} FOUND (+10 XP EACH)</span>
        </div>
      </div>

      {/* Main Room Viewport */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-b from-[#1f0923] via-[#140516] to-[#09020b] border-2 border-pink-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(244,114,182,0.25)] select-none">
        {/* Soft Ambient Room Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Room Header Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-pink-500/30 text-xs font-mono text-pink-200 flex items-center gap-2">
          <Crown className="w-3.5 h-3.5 text-amber-300" />
          <span>HANNA&apos;S PRINCESS SANCTUARY</span>
        </div>

        {/* Room Interactive Floating Points */}
        {roomObjects.map((obj) => {
          const isFound = interactedObjects.includes(obj.id);
          return (
            <motion.button
              key={obj.id}
              onClick={() => handleObjectClick(obj)}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.92 }}
              style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20 focus:outline-none"
            >
              {/* Outer pulsing ring for uninspected items */}
              {!isFound && (
                <span className="absolute -inset-2 rounded-full bg-pink-400/30 animate-ping pointer-events-none" />
              )}

              {/* Item Circle */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl border-2 transition-all shadow-lg ${
                isFound
                  ? 'bg-[#2a0c2c]/90 border-pink-400/80 text-pink-100 shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                  : 'bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-200 border-white text-black animate-bounce shadow-[0_0_20px_rgba(244,114,182,0.8)]'
              }`}>
                {obj.icon}
              </div>

              {/* Item Label Tooltip */}
              <span className="mt-1 text-[10px] font-mono font-bold bg-black/85 text-pink-200 px-2 py-0.5 rounded-full border border-pink-500/40 opacity-90 group-hover:opacity-100 whitespace-nowrap shadow-md">
                {obj.name.split(' ')[0]}
              </span>
            </motion.button>
          );
        })}

        {/* Room Floor Decorative Grid */}
        <div 
          className="absolute bottom-0 inset-x-0 h-1/3 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(244,114,182,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,114,182,0.2) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            transform: 'perspective(300px) rotateX(45deg)'
          }}
        />
      </div>

      {/* Object Inspection Modal / Dialog */}
      <AnimatePresence>
        {selectedObj && (
          <div 
            onClick={() => {
              sound.playClick();
              setSelectedObj(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-[#1a071c] border-2 border-pink-400/80 rounded-3xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(244,114,182,0.4)] relative"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedObj(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl p-3 bg-pink-950/60 rounded-2xl border border-pink-500/40">
                  {selectedObj.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold bg-pink-950 text-amber-300 border border-pink-500/40 px-2.5 py-0.5 rounded-full">
                    {selectedObj.tag}
                  </span>
                  <h3 className="font-serif-fancy font-bold text-lg text-white mt-1">
                    {selectedObj.name}
                  </h3>
                </div>
              </div>

              <p className="font-sans text-xs sm:text-sm text-pink-100 leading-relaxed bg-[#0c020d] p-4 rounded-2xl border border-pink-500/30 mb-5">
                {selectedObj.dialog}
              </p>

              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedObj(null);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-serif-fancy font-bold text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer uppercase tracking-wider"
              >
                CLOSE KEEPSAKE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
