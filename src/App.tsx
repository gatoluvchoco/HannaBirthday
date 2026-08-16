import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveSection, AppConfig, MemoryItem, StoryEvent, UserProgress } from './types';
import { 
  loadStoredConfig, 
  loadStoredProgress, 
  saveStoredConfig, 
  saveStoredProgress, 
  resetStoredProgress,
  INITIAL_PROGRESS 
} from './utils/storage';
import { sound } from './utils/audio';
import confetti from 'canvas-confetti';

import { StarfieldBackground } from './components/StarfieldBackground';
import { LoadingScreen } from './components/LoadingScreen';
import { HeaderHUD } from './components/HeaderHUD';
import { MainMenu } from './components/MainMenu';
import { OurStory } from './components/OurStory';
import { MemoryGallery } from './components/MemoryGallery';
import { VirtualRoom } from './components/VirtualRoom';
import { GamesMenu } from './components/MiniGames/GamesMenu';
import { LoveLetter } from './components/LoveLetter';
import { FinalSurprise } from './components/FinalSurprise';
import { ConfigModal } from './components/ConfigModal';
import { Sparkles, Heart, Trophy, X } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(loadStoredConfig);
  const [progress, setProgress] = useState<UserProgress>(loadStoredProgress);
  const [activeSection, setActiveSection] = useState<ActiveSection>('loading');
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [xpToast, setXpToast] = useState<{ id: number; amount: number; reason: string } | null>(null);
  const [easterEggModal, setEasterEggModal] = useState(false);

  // Save progress whenever it updates
  useEffect(() => {
    saveStoredProgress(progress);
  }, [progress]);

  // Save config whenever it updates
  useEffect(() => {
    saveStoredConfig(config);
  }, [config]);

  // Ensure progress is immediately saved on tab close / browser minimize
  useEffect(() => {
    const handleSaveOnExit = () => {
      saveStoredProgress(progress);
      saveStoredConfig(config);
    };

    window.addEventListener('beforeunload', handleSaveOnExit);
    window.addEventListener('pagehide', handleSaveOnExit);
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        handleSaveOnExit();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', handleSaveOnExit);
      window.removeEventListener('pagehide', handleSaveOnExit);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [progress, config]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Handle XP gains with sound & floating badge and immediate atomic storage
  const addXP = useCallback((amount: number, reason: string) => {
    setProgress((prev) => {
      const nextXP = Math.min(config.targetXP, prev.xp + amount);
      const isNewlyMaxed = prev.xp < config.targetXP && nextXP >= config.targetXP;

      if (isNewlyMaxed) {
        sound.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#f472b6', '#fbbf24', '#fbcfe8', '#fda4af', '#4ade80', '#ffffff']
        });
      }

      const updatedProgress: UserProgress = {
        ...prev,
        xp: nextXP,
        lastSaved: Date.now(),
      };

      // Immediate synchronous persistence
      saveStoredProgress(updatedProgress);
      return updatedProgress;
    });

    setXpToast({ id: Date.now(), amount, reason });
    setTimeout(() => {
      setXpToast(null);
    }, 2800);
  }, [config.targetXP]);

  // Manual save trigger from Header
  const handleManualSave = useCallback(() => {
    saveStoredProgress(progress);
    saveStoredConfig(config);
    setXpToast({
      id: Date.now(),
      amount: 0,
      reason: `Saved to device! (${progress.xp}/${config.targetXP} XP ready)`
    });
    setTimeout(() => {
      setXpToast(null);
    }, 2500);
  }, [progress, config]);

  // Navigation Handler with section visit tracking
  const navigateTo = (section: ActiveSection) => {
    setActiveSection(section);
    if (section !== 'main-menu' && section !== 'loading') {
      if (!progress.visitedSections.includes(section)) {
        setProgress(p => {
          const updated = {
            ...p,
            visitedSections: [...p.visitedSections, section]
          };
          saveStoredProgress(updated);
          return updated;
        });
      }
    }
  };

  // Easter Egg Handler
  const triggerEasterEgg = () => {
    setEasterEggModal(true);
    sound.playLevelUp();
    if (!progress.easterEggFound) {
      setProgress(p => {
        const updated = { ...p, easterEggFound: true };
        saveStoredProgress(updated);
        return updated;
      });
      addXP(25, "Found Secret Easter Egg!");
    }
  };

  // Konami Code Listener (↑ ↑ ↓ ↓ ← → ← → b a)
  useEffect(() => {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let keyIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === konamiSequence[keyIndex].toLowerCase()) {
        keyIndex++;
        if (keyIndex === konamiSequence.length) {
          triggerEasterEgg();
          keyIndex = 0;
        }
      } else {
        keyIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Story & Memory item updates
  const handleAddStoryEvent = (event: StoryEvent) => {
    setConfig(prev => ({
      ...prev,
      story: [...prev.story, event]
    }));
  };

  const handleAddMemory = (memory: MemoryItem) => {
    setConfig(prev => ({
      ...prev,
      memories: [...prev.memories, memory]
    }));
  };

  const handleUpdateLetter = (newMsg: string) => {
    setConfig(prev => ({
      ...prev,
      letterMsg: newMsg
    }));
  };

  const handleRedeemCoupon = (couponId: string) => {
    setProgress(prev => {
      if (prev.redeemedCoupons.includes(couponId)) return prev;
      return {
        ...prev,
        redeemedCoupons: [...prev.redeemedCoupons, couponId]
      };
    });
    setConfig(prev => ({
      ...prev,
      coupons: prev.coupons.map(c => c.id === couponId ? { ...c, redeemed: true } : c)
    }));
  };

  const handleInstantUnlockXP = () => {
    setProgress(prev => ({
      ...prev,
      xp: config.targetXP
    }));
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
  };

  const handleResetProgress = () => {
    const clean = resetStoredProgress();
    setProgress(clean);
    setActiveSection('loading');
  };

  return (
    <div className="min-h-screen text-[#fdf2f8] font-main relative overflow-x-hidden select-none bg-[#070509]">
      {/* Background Starlight Engine & CRT scanlines */}
      <StarfieldBackground crtEnabled={crtEnabled} />

      {/* Floating XP Reward Notification */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#280829]/95 border-2 border-pink-400 text-pink-200 px-4 py-2 rounded-2xl shadow-2xl glow-pink flex items-center gap-2.5 backdrop-blur-md"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 text-black flex items-center justify-center font-mono text-xs font-black shadow-md">
              +{xpToast.amount}
            </div>
            <div className="text-xs font-mono">
              <span className="font-bold text-amber-300">XP EARNED! </span>
              <span>{xpToast.reason}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {easterEggModal && (
          <div 
            onClick={() => {
              sound.playClick();
              setEasterEggModal(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#1c071e] border-2 border-amber-300 rounded-3xl p-6 max-w-md w-full text-center glow-gold relative shadow-2xl"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setEasterEggModal(false);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-pink-950 border border-pink-700 text-pink-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-4xl mb-2 animate-bounce">🏎️ 💖 👑</div>
              <h3 className="font-serif-fancy font-black text-lg text-amber-200 glow-text-gold mb-2">
                SECRET PRINCESS DISCOVERY!
              </h3>
              <p className="font-sans text-xs sm:text-sm text-pink-100 leading-relaxed mb-4">
                &quot;Hanna, every pixel, melody, and line of code was crafted to make you smile. You are Afiq&apos;s ultimate favorite person in this life and beyond!&quot;
              </p>
              <span className="font-mono text-[11px] bg-amber-500/20 text-amber-300 border border-amber-400 px-3.5 py-1.5 rounded-full font-bold">
                ★ SECRET BONUS: +25 XP AWARDED ★
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Config Studio Modal */}
      {isSettingsOpen && (
        <ConfigModal
          config={config}
          onSaveConfig={setConfig}
          onClose={() => setIsSettingsOpen(false)}
          onInstantUnlockXP={handleInstantUnlockXP}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* Screen Routing */}
      {activeSection === 'loading' ? (
        <LoadingScreen
          onStart={() => navigateTo('main-menu')}
          onResetProgress={handleResetProgress}
          girlfriendName={config.girlfriendName}
          level={config.level}
          savedXP={progress.xp}
          targetXP={config.targetXP}
        />
      ) : (
        <div className="min-h-screen flex flex-col justify-between pt-3 pb-8 px-2 sm:px-4">
          {/* Top HUD with player stats & XP bar */}
          <HeaderHUD
            playerName={config.girlfriendName}
            level={config.level}
            xp={progress.xp}
            targetXP={config.targetXP}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            crtEnabled={crtEnabled}
            onToggleCRT={() => setCrtEnabled(prev => !prev)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onTriggerEasterEgg={triggerEasterEgg}
            onManualSave={handleManualSave}
          />

          {/* Active Interactive Section */}
          <main className="flex-1 flex flex-col items-center justify-center w-full">
            {activeSection === 'main-menu' && (
              <MainMenu
                onNavigate={navigateTo}
                xp={progress.xp}
                targetXP={config.targetXP}
                musicTitle={config.musicTitle}
                visitedSections={progress.visitedSections}
                gamesWon={progress.gamesWon}
                progress={progress}
              />
            )}

            {activeSection === 'story' && (
              <OurStory
                story={config.story}
                visitedEvents={progress.visitedStoryEvents || []}
                onBack={() => navigateTo('main-menu')}
                onGainXP={(amt, id) => {
                  addXP(amt, "Explored Story Chapter");
                  if (id) {
                    setProgress(p => {
                      const updated = {
                        ...p,
                        visitedStoryEvents: p.visitedStoryEvents?.includes(id)
                          ? p.visitedStoryEvents
                          : [...(p.visitedStoryEvents || []), id]
                      };
                      saveStoredProgress(updated);
                      return updated;
                    });
                  }
                }}
                onAddStoryEvent={handleAddStoryEvent}
              />
            )}

            {activeSection === 'memories' && (
              <MemoryGallery
                memories={config.memories}
                visitedMemories={progress.visitedMemories || []}
                onBack={() => navigateTo('main-menu')}
                onGainXP={(amt, id) => {
                  addXP(amt, "Viewed Sweet Polaroid");
                  if (id) {
                    setProgress(p => {
                      const updated = {
                        ...p,
                        visitedMemories: p.visitedMemories?.includes(id)
                          ? p.visitedMemories
                          : [...(p.visitedMemories || []), id]
                      };
                      saveStoredProgress(updated);
                      return updated;
                    });
                  }
                }}
                onAddMemory={handleAddMemory}
              />
            )}

            {activeSection === 'room' && (
              <VirtualRoom
                girlfriendName={config.girlfriendName}
                interactedObjects={progress.interactedObjects || []}
                onBack={() => navigateTo('main-menu')}
                onGainXP={(amt, id) => {
                  addXP(amt, "Found Room Keepsake");
                  if (id) {
                    setProgress(p => {
                      const updated = {
                        ...p,
                        interactedObjects: p.interactedObjects.includes(id)
                          ? p.interactedObjects
                          : [...p.interactedObjects, id]
                      };
                      saveStoredProgress(updated);
                      return updated;
                    });
                  }
                }}
              />
            )}

            {activeSection === 'games-menu' && (
              <GamesMenu
                girlfriendName={config.girlfriendName}
                onBack={() => navigateTo('main-menu')}
                onWinGame={(gameId, xp) => {
                  addXP(xp, `Cleared ${gameId} Mini-Game!`);
                  setProgress(p => {
                    const updated = {
                      ...p,
                      gamesWon: p.gamesWon.includes(gameId) ? p.gamesWon : [...p.gamesWon, gameId]
                    };
                    saveStoredProgress(updated);
                    return updated;
                  });
                }}
                gamesWon={progress.gamesWon}
              />
            )}

            {activeSection === 'letter' && (
              <LoveLetter
                girlfriendName={config.girlfriendName}
                yourName={config.yourName}
                letterMsg={config.letterMsg}
                onBack={() => navigateTo('main-menu')}
                onUpdateLetter={handleUpdateLetter}
                onGainXP={(amt) => {
                  addXP(amt, "Unsealed Love Letter");
                  setProgress(p => {
                    const updated = { ...p, letterOpened: true };
                    saveStoredProgress(updated);
                    return updated;
                  });
                }}
                isLetterOpened={progress.letterOpened}
              />
            )}

            {activeSection === 'final-surprise' && (
              <FinalSurprise
                girlfriendName={config.girlfriendName}
                yourName={config.yourName}
                finalMsg={config.finalMsg}
                finalSurpriseURL={config.finalSurpriseURL}
                coupons={config.coupons}
                onBack={() => navigateTo('main-menu')}
                onRedeemCoupon={handleRedeemCoupon}
              />
            )}
          </main>

          {/* Bottom subtle copyright */}
          <footer className="text-center mt-6 text-[11px] font-mono text-pink-400/60 select-none">
            {config.girlfriendName.toUpperCase()}.EXE &bull; LEVEL {config.level} BIRTHDAY CELEBRATION &bull; BY {config.yourName.toUpperCase()} WITH INFINITE LOVE 💖
          </footer>
        </div>
      )}
    </div>
  );
}
