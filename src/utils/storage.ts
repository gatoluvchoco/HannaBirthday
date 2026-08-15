import { AppConfig, UserProgress } from '../types';

export const DEFAULT_CONFIG: AppConfig = {
  girlfriendName: "Hanna",
  yourName: "Afiq",
  birthdayDate: "2026-08-20",
  level: 23,
  targetXP: 100,
  musicTitle: "Happy Birthday",
  finalSurpriseURL: "https://photos.google.com",
  finalMsg: "Distance may keep us apart at times, but my heart beats exclusively for you, Hanna. Watching you grow into the most radiant, talented, and gorgeous woman in the universe is my life's greatest honor. Happy 23rd Birthday, my love! 💚✨",
  letterMsg: `To My Dearest Hanna,\n\nHappy 23rd Birthday, my love!\n\nI built this digital sanctuary for you because words on paper could never capture how much you mean to me. From the very first moment we talked, you completely shifted my world. Your radiant smile, your infectious laughter, the way your eyes light up when you're passionate about something, and your immense warmth make every single day brighter.\n\nReaching Level 23 is a huge milestone. In this grand adventure of life, I promise to be your player two, your biggest cheerleader, your passenger seat copilot in that dream Porsche, and the one who always holds your hand through every level ahead.\n\nThank you for loving me, for being my best friend, and for being the most incredible girlfriend in the entire universe. I love you more than all the stars in the cosmos.\n\nForever yours,\nAfiq ❤️💚`,
  story: [
    {
      id: "story-1",
      date: "October 2023",
      title: "The First Spark ✨",
      msg: "The unforgettable day our paths crossed. A simple conversation that effortlessly turned into hours of laughter and butterflies.",
      icon: "Sparkles",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "story-2",
      date: "December 2023",
      title: "First Magical Date ☕",
      msg: "Cold winter air, warm coffee, and the exact moment I looked across the table and knew you were the one.",
      icon: "Coffee",
      image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "story-3",
      date: "April 2024",
      title: "Midnight Drives & Secret Stars 🌌",
      msg: "Blasting our favorite playlist down empty roads, singing terribly, and wishing the night would never end.",
      icon: "Car",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "story-4",
      date: "August 20, 2026",
      title: "Level 23: The Grand Milestone 👑",
      msg: "Celebrating your 23rd year on this earth. The sweetest, smartest, most gorgeous girl in the universe levels up to 23 today!",
      icon: "Crown",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"
    }
  ],
  memories: [
    {
      id: "mem-1",
      title: "Golden Hour Sunset 🌅",
      desc: "Sitting by the beach, watching the sky turn emerald and gold while you laughed at my silly jokes.",
      date: "June 2024",
      tag: "Romance",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "mem-2",
      title: "Late Night FaceTime 🌙",
      desc: "Falling asleep together on call when hours felt like seconds. Never wanting to say goodbye.",
      date: "March 2024",
      tag: "Sweet Moments",
      img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "mem-3",
      title: "Matcha & Boba Dates 🍵",
      desc: "Our mandatory weekly cafe ritual. Stealing sips of each other's drinks and sharing pastries.",
      date: "January 2024",
      tag: "Foodie",
      img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "mem-4",
      title: "Stargazing on the Hood 🏎️",
      desc: "Counting shooting stars while talking about all our future dreams, trips, and adventures together.",
      date: "May 2024",
      tag: "Dreams",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    }
  ],
  coupons: [
    {
      id: "c-1",
      title: "1x Porsche Joyride & Late Night Drive",
      description: "Redeemable anytime for midnight snacks, playlist control, and a thrilling cruise.",
      icon: "🏎️",
      redeemed: false
    },
    {
      id: "c-2",
      title: "Unlimited Hugs & Cuddle Pass",
      description: "Valid forever. No expiration date, zero cooldown timer.",
      icon: "🧸",
      redeemed: false
    },
    {
      id: "c-3",
      title: "Afiq Cooks Your Favorite Dinner",
      description: "Any gourmet meal or dessert of your choice prepared with maximum love.",
      icon: "🍽️",
      redeemed: false
    },
    {
      id: "c-4",
      title: "Shopping Spree & Cafe Day",
      description: "A whole day dedicated entirely to pampering Hanna, iced matcha included!",
      icon: "🛍️",
      redeemed: false
    }
  ],
  trivia: [
    {
      id: "q-1",
      question: "What is Hanna's absolute ultimate dream car?",
      options: ["Porsche 911 GT3 RS", "Toyota Prius", "Batmobile", "Scooter"],
      correctIndex: 0,
      explanation: "Obviously the Porsche GT3 RS! Speed, style, and perfection just like her!"
    },
    {
      id: "q-2",
      question: "Who is the cutest and most gorgeous girl in the whole galaxy?",
      options: ["Hanna", "Definitely Hanna", "Hanna again", "All of the above ❤️"],
      correctIndex: 3,
      explanation: "There is only one correct answer and it's Hanna 100% of the time!"
    },
    {
      id: "q-3",
      question: "What happens when Afiq looks at Hanna?",
      options: ["Heart rate doubles", "Instant smile", "Falling in love all over again", "All of the above"],
      correctIndex: 3,
      explanation: "Scientific fact verified by Afiq's heart monitors!"
    },
    {
      id: "q-4",
      question: "What is Hanna's official current player status?",
      options: ["Level 22 Veteran", "Level 23 Birthday Queen 👑", "Boss Monster", "AFK Player"],
      correctIndex: 1,
      explanation: "Level 23 unlocked with maximum charisma, beauty, and wisdom stats!"
    }
  ]
};

const PROGRESS_KEY = 'hanna_exe_progress_v3';
const BACKUP_XP_KEY = 'hanna_exe_xp_backup';
const CONFIG_KEY = 'hanna_exe_config_v3';

export const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  visitedSections: [],
  interactedObjects: [],
  visitedStoryEvents: [],
  visitedMemories: [],
  gamesWon: [],
  letterOpened: false,
  candlesBlown: false,
  redeemedCoupons: [],
  easterEggFound: false,
  lastSaved: Date.now(),
};

export function loadStoredProgress(): UserProgress {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (!data) {
      // First time player: start cleanly at 0 XP
      return { ...INITIAL_PROGRESS };
    }

    const parsed = JSON.parse(data);

    const safeProgress: UserProgress = {
      xp: typeof parsed?.xp === 'number' && !isNaN(parsed.xp) ? Math.max(0, parsed.xp) : 0,
      visitedSections: Array.isArray(parsed?.visitedSections) ? parsed.visitedSections : [],
      interactedObjects: Array.isArray(parsed?.interactedObjects) ? parsed.interactedObjects : [],
      visitedStoryEvents: Array.isArray(parsed?.visitedStoryEvents) ? parsed.visitedStoryEvents : [],
      visitedMemories: Array.isArray(parsed?.visitedMemories) ? parsed.visitedMemories : [],
      gamesWon: Array.isArray(parsed?.gamesWon) ? parsed.gamesWon : [],
      letterOpened: Boolean(parsed?.letterOpened),
      candlesBlown: Boolean(parsed?.candlesBlown),
      redeemedCoupons: Array.isArray(parsed?.redeemedCoupons) ? parsed.redeemedCoupons : [],
      easterEggFound: Boolean(parsed?.easterEggFound),
      lastSaved: parsed?.lastSaved || Date.now(),
    };

    return safeProgress;
  } catch (e) {
    console.warn("Recovered from progress load failure, starting at 0", e);
    return { ...INITIAL_PROGRESS };
  }
}

export function resetStoredProgress(): UserProgress {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(BACKUP_XP_KEY);
    localStorage.removeItem('hanna_exe_progress_v2');
    localStorage.removeItem('hanna_exe_progress');
    localStorage.removeItem('hanna_xp_data');
    sessionStorage.removeItem(PROGRESS_KEY);
  } catch {
    // ignore
  }
  const clean = { ...INITIAL_PROGRESS, lastSaved: Date.now() };
  saveStoredProgress(clean);
  return clean;
}

export function saveStoredProgress(progress: UserProgress): void {
  try {
    const updated = {
      ...progress,
      lastSaved: Date.now(),
    };
    const json = JSON.stringify(updated);
    
    // Save to primary storage
    localStorage.setItem(PROGRESS_KEY, json);
    // Redundant direct XP backup key
    localStorage.setItem(BACKUP_XP_KEY, String(progress.xp || 0));

    // Try session storage backup
    try {
      sessionStorage.setItem(PROGRESS_KEY, json);
    } catch {
      // ignore
    }
  } catch (e) {
    console.error("Failed to save progress", e);
  }
}

export function loadStoredConfig(): AppConfig {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    if (!data) return DEFAULT_CONFIG;
    const parsed = JSON.parse(data);
    let musicTitle = parsed.musicTitle;
    if (!musicTitle || musicTitle.includes('Melody') || musicTitle.includes('Lofi') || musicTitle.includes('Starlight')) {
      musicTitle = "Happy Birthday";
    }
    return { 
      ...DEFAULT_CONFIG, 
      ...parsed, 
      musicTitle: musicTitle || "Happy Birthday",
      level: parsed.level === 20 ? 23 : (parsed.level || 23) 
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveStoredConfig(config: AppConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config", e);
  }
}
