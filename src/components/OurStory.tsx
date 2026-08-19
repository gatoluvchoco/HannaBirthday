import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { StoryEvent } from '../types';
import { ArrowLeft, Sparkles, Heart, Calendar, Plus, X } from 'lucide-react';

interface OurStoryProps {
  story: StoryEvent[];
  visitedEvents?: string[];
  onBack: () => void;
  onAddStoryEvent: (event: StoryEvent) => void;
  onGainXP: (amount: number, eventId?: string) => void;
}

export const OurStory: React.FC<OurStoryProps> = ({
  story,
  visitedEvents = [],
  onBack,
  onAddStoryEvent,
  onGainXP,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<StoryEvent | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [localClicked, setLocalClicked] = useState<string[]>(visitedEvents);

  const allClicked = Array.from(new Set([...visitedEvents, ...localClicked]));

  // Form fields for adding new memory chapter
  const [newDate, setNewDate] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const [newImg, setNewImg] = useState('');

  const handleEventClick = (event: StoryEvent) => {
    sound.playHeartCatch();
    setSelectedEvent(event);
    if (!allClicked.includes(event.id)) {
      setLocalClicked(prev => [...prev, event.id]);
      onGainXP(5, event.id);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate.trim() || !newTitle.trim() || !newMsg.trim()) return;

    const newEvent: StoryEvent = {
      id: `story-${Date.now()}`,
      date: newDate.trim(),
      title: newTitle.trim(),
      msg: newMsg.trim(),
      image: newImg.trim() || undefined,
    };

    onAddStoryEvent(newEvent);
    onGainXP(10);
    sound.playLevelUp();

    // Reset form
    setNewDate('');
    setNewTitle('');
    setNewMsg('');
    setNewImg('');
    setIsAdding(false);
  };

  const getStoryImage = (item: StoryEvent): string => {
    if (item.image && !item.image.includes('unsplash')) return item.image;
    if (item.id === 'st-1' || item.title.toLowerCase().includes('blond') || item.title.toLowerCase().includes('sweater')) {
      return "https://i.postimg.cc/pTQkgWC7/pic1.jpg";
    }
    if (item.id === 'st-2' || item.title.toLowerCase().includes('roblox')) {
      return "https://i.postimg.cc/0QGZLknL/pic2.jpg";
    }
    if (item.id === 'st-3' || item.title.toLowerCase().includes('laptop') || item.title.toLowerCase().includes('call')) {
      return "https://i.postimg.cc/RF1GjSdb/pic3.jpg";
    }
    if (item.id === 'st-4' || item.title.toLowerCase().includes('level 23') || item.title.toLowerCase().includes('milestone')) {
      return "https://i.postimg.cc/761XpH9d/pic4.jpg";
    }
    return item.image || "https://i.postimg.cc/761XpH9d/pic4.jpg";
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 z-10">
      {/* Top Bar with Back Button */}
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

        <button
          onClick={() => {
            sound.playClick();
            setIsAdding(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 hover:brightness-110 text-[#1f051c] text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD CHAPTER</span>
        </button>
      </div>

      {/* Header Bento Title */}
      <div className="text-center mb-8 bg-[#140616]/85 border border-pink-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-[0_8px_30px_rgba(244,114,182,0.15)]">
        <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 shadow-sm">
          <span>🌸</span>
          <span>OUR LOVE TIMELINE (2024 - 2026+)</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif-fancy font-black text-white">
          CHAPTERS OF US
        </h2>
        <p className="text-xs sm:text-sm font-sans text-pink-100/75 mt-1.5 max-w-lg mx-auto">
          Every romantic date, sunset walk, and quiet moment shared with my favourite girl. Tap any chapter to read the memory and gain XP.
        </p>
      </div>

      {/* Bento Grid Story Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
        {story.map((item, idx) => {
          const isClicked = allClicked.includes(item.id);
          const itemImg = getStoryImage(item);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-gradient-to-br from-[#1b081e]/90 to-[#120414]/90 border border-pink-500/30 hover:border-pink-400 rounded-3xl p-5 flex flex-col justify-between cursor-pointer group hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(244,114,182,0.2)] transition-all select-none relative overflow-hidden"
              onClick={() => handleEventClick(item)}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-200 bg-black/40 border border-amber-300/30 px-3 py-1 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    {item.date}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    isClicked 
                      ? 'bg-pink-950/80 text-pink-300 border-pink-500/40' 
                      : 'bg-black/40 text-pink-200/60 border-pink-900/30'
                  }`}>
                    {isClicked ? '✓ INSPECTED' : '+5 XP'}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-serif-fancy font-bold text-white group-hover:text-pink-200 mb-2 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-pink-100/80 line-clamp-3 leading-relaxed mb-3">
                  {item.msg}
                </p>
              </div>

              {/* Direct Image Frame */}
              <div className="mt-2 rounded-2xl overflow-hidden border border-pink-500/40 h-44 sm:h-48 relative bg-black/40 shadow-md">
                <img 
                  src={itemImg} 
                  alt={item.title}
                  style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0310]/70 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div 
            onClick={() => {
              sound.playClick();
              setSelectedEvent(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#160618] border-2 border-pink-400/60 rounded-3xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(244,114,182,0.3)] relative"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedEvent(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-amber-200 mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedEvent.date}</span>
              </div>

              <h3 className="text-xl font-serif-fancy font-bold text-white mb-3">
                {selectedEvent.title}
              </h3>

              <div className="rounded-2xl overflow-hidden border border-pink-500/40 mb-4 h-52 sm:h-60 bg-black/50 shadow-md">
                <img 
                  src={getStoryImage(selectedEvent)} 
                  alt={selectedEvent.title} 
                  style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
                  className="w-full h-full object-cover" 
                />
              </div>

              <p className="text-sm font-sans text-pink-100/90 leading-relaxed mb-5">
                {selectedEvent.msg}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedEvent(null);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-bold text-xs rounded-2xl hover:brightness-110 transition-all cursor-pointer uppercase tracking-wider"
                >
                  CLOSE MEMORY
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Chapter Modal */}
      <AnimatePresence>
        {isAdding && (
          <div 
            onClick={() => {
              sound.playClick();
              setIsAdding(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#160618] border-2 border-pink-400/60 rounded-3xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(244,114,182,0.3)] relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-serif-fancy font-bold text-pink-200">ADD NEW CHAPTER</h3>
                <button 
                  onClick={() => {
                    sound.playClick();
                    setIsAdding(false);
                  }} 
                  className="p-1.5 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 hover:bg-pink-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-pink-200 mb-1">Date / Month</label>
                  <input
                    type="text"
                    placeholder="e.g. October 2024"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#0d030e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pink-200 mb-1">Milestone Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Our Cozy Coffee Date & Roses"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#0d030e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pink-200 mb-1">What happened? (Romantic Note)</label>
                  <textarea
                    rows={3}
                    placeholder="Describe this precious moment with Hanna..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    className="w-full bg-[#0d030e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pink-200 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newImg}
                    onChange={(e) => setNewImg(e.target.value)}
                    className="w-full bg-[#0d030e] border border-pink-500/40 rounded-xl p-2.5 text-pink-100 focus:border-pink-300 focus:outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded-xl bg-[#230b26] border border-pink-500/40 text-pink-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 text-[#1f051c] font-bold hover:brightness-110 shadow-md cursor-pointer"
                  >
                    Save (+10 XP)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
