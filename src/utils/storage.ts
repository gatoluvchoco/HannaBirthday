import { AppConfig, UserProgress } from '../types';

const CONFIG_KEY = 'hanna_exe_config_v3';
const PROGRESS_KEY = 'hanna_exe_progress_v3';
const BACKUP_XP_KEY = 'hanna_exe_backup_xp_v3';

export const DEFAULT_CONFIG: AppConfig = {
  girlfriendName: "Hanna",
  yourName: "Afiq",
  birthdayDate: "2003-03-24", // Hanna's Birthday
  level: 23, // Princess Hanna's Level 23 Birthday
  targetXP: 250,
  musicTitle: "Frank Ocean - Godspeed 🕊️🎹",
  finalSurpriseURL: "https://open.spotify.com",
  finalMsg: "Happy 23rd Birthday Hanna! You are my forever Princess.",
  letterMsg: `My dearest Hanna,\n\nHappy 23rd Birthday, my love! 👑💖\n\nTurning 23 is such a special milestone, and I feel so incredibly grateful to celebrate this day with you. From the first time we talked to all the late-night laughs, silly jokes, and quiet moments where we don't even need words—you've brought so much warmth, comfort, and pure happiness into my life.\n\nYou have this radiant energy that lights up everywhere you go, and your smile is still my absolute favourite thing in the entire world.\n\nAs you step into Level 23, I promise to always cheer for your dreams, hold your hand through every adventure, buy you your favourite iced matcha and sweet treats, and love you more and more every single day.\n\nHappy Birthday, my princess. Here's to us, today and forever.\n\nForever & always yours,\nAfiq 🌹✨`,
  story: [
    {
      id: "st-1",
      date: "July 2024",
      title: "Blond Sweater",
      msg: "The day you gave me this sweater is a moment etched forever in my heart. Wearing it feels like being wrapped in your warmest hug, carrying your love and sweetness everywhere I go. It brought the biggest smile to my face and made me truly, deeply happy.",
      icon: "🧶",
      image: "https://i.postimg.cc/pTQkgWC7/pic1.jpg"
    },
    {
      id: "st-2",
      date: "August 2025",
      title: "Roblox Adventures",
      msg: "I remember back then when I played Roblox with you, every single moment was pure joy, filled with sweet laughter and cute chaos. Running around virtual worlds hand in hand with you turned simple games into the most precious, unforgettable memories that I cherish so deeply.",
      icon: "🎮",
      image: "https://i.postimg.cc/0QGZLknL/pic2.jpg"
    },
    {
      id: "st-3",
      date: "August 2024",
      title: "Call from My Laptop",
      msg: "I still remember those nights when my phone was barely working, so I stayed on video calls with you through my laptop until we both fell asleep. Having your gentle voice and sweet presence by my side made every night feel so comforting and warm. I truly miss those wonderful days and cherish every late night we spent together.",
      icon: "💻",
      image: "https://i.postimg.cc/RF1GjSdb/pic3.jpg"
    },
    {
      id: "st-4",
      date: "August 2026",
      title: "Level 23: The Grand Milestone",
      msg: "Celebrating Hanna's royal 23rd birthday! The story is still being written, and the best is yet to come.",
      icon: "👑",
      image: "https://i.postimg.cc/761XpH9d/pic4.jpg"
    }
  ],
  coupons: [
    {
      id: "c-1",
      title: "Unlimited Late-Night Talks 🌙",
      description: "Redeemable anytime for deep conversations and sweet dreams.",
      icon: "🌙",
      redeemed: false
    },
    {
      id: "c-2",
      title: "Porsche Passenger Seat Pass 🏎️",
      description: "VIP access to the front seat on our dream coastal road trip.",
      icon: "🏎️",
      redeemed: false
    },
    {
      id: "c-3",
      title: "Iced Matcha Delivery 🍵",
      description: "One giant delicious matcha latte ordered straight to your hands.",
      icon: "🍵",
      redeemed: false
    },
    {
      id: "c-4",
      title: "Infinite Hugs & Cuddles 🧸",
      description: "Never-expiring pass for unlimited warm hugs whenever you need one.",
      icon: "🧸",
      redeemed: false
    }
  ],
  trivia: [
    // ROUND 1 — HOW WELL DO YOU KNOW US? (⭐⭐ Medium)
    {
      id: "q-1",
      question: "What was one of the first things Afiq noticed about Hanna?",
      options: ["Her personality", "Her smile", "Her voice", "Her way of talking"],
      correctIndex: 0,
      explanation: "Her amazing personality was one of the first things that captured Afiq's heart! ✨"
    },
    {
      id: "q-2",
      question: "Which color is most associated with Hanna?",
      options: ["Pink", "Blue", "Green", "Purple"],
      correctIndex: 2,
      explanation: "Green 💚 is Hanna's iconic signature color!"
    },
    {
      id: "q-3",
      question: "Which combination is the most \"Hanna\"?",
      options: ["Flowers + ocean + stars", "Teddy bear + flowers + green", "Green + teddy bear + Porsche", "All of them 💚"],
      correctIndex: 3,
      explanation: "All of them combined represent pure Hanna! 💚🧸🏎️"
    },
    {
      id: "q-4",
      question: "If Hanna could choose one dream car, which would she pick?",
      options: ["Lamborghini Huracán", "Porsche GT3 RS", "Ferrari 488", "Nissan GTR"],
      correctIndex: 1,
      explanation: "The legendary Porsche GT3 RS! 🏎️💨"
    },
    {
      id: "q-5",
      question: "Which chocolate is Hanna's favourite?",
      options: ["Ferrero Rocher", "Kinder Bueno", "KitKat", "Toblerone"],
      correctIndex: 1,
      explanation: "Kinder Bueno, crispy hazelnut chocolate perfection! 🍫"
    },

    // ROUND 2 — HARDER "US" QUESTIONS (⭐⭐⭐ Hard)
    {
      id: "q-6",
      question: "Which one of these would Afiq most likely choose for a date with Hanna?",
      options: ["Fancy restaurant", "Movie night", "Exploring somewhere neither has been before", "Just spending the whole day together"],
      correctIndex: 3,
      explanation: "Just spending the whole uninterrupted day wrapped in each other's presence! ❤️"
    },
    {
      id: "q-7",
      question: "If Hanna suddenly says \"I'm fine 🙂\", what does Afiq know that probably means?",
      options: ["She's actually fine", "She wants food", "Something is definitely wrong 👀", "She wants to sleep"],
      correctIndex: 2,
      explanation: "Afiq knows 'I'm fine 🙂' means something is definitely up and she needs extra love & comfort! 👀❤️"
    },
    {
      id: "q-8",
      question: "What would probably make Hanna happier?",
      options: ["An expensive gift", "Spend time around her", "Money", "A random luxury item"],
      correctIndex: 1,
      explanation: "Spending warm, dedicated quality time together means everything to her! 🧸"
    },
    {
      id: "q-9",
      question: "Which one would be the most meaningful gift for our relationship?",
      options: ["Expensive perfume", "Jewellery", "Something handmade/personalized", "Cash"],
      correctIndex: 2,
      explanation: "Something made with personal thought and love holds infinite value! 💌"
    },
    {
      id: "q-10",
      question: "If we finally got to spend a whole day together after a long time apart, what would probably matter most?",
      options: ["Taking lots of photos", "Going somewhere expensive", "Making the day memorable", "Simply having time together"],
      correctIndex: 3,
      explanation: "Simply having time together hand-in-hand without any hurry! ❤️"
    },

    // ROUND 3 — COUPLE PSYCHOLOGY (⭐⭐⭐⭐ Very Hard)
    {
      id: "q-11",
      question: "In a long-distance relationship, which factor is generally most important for maintaining trust?",
      options: ["Constant messaging", "Transparency and consistency", "Never arguing", "Always knowing where your partner is"],
      correctIndex: 1,
      explanation: "Transparency, honesty, and consistency build unbreakable long-distance trust!"
    },
    {
      id: "q-12",
      question: "Which behavior generally strengthens a relationship most over time?",
      options: ["Avoiding difficult conversations", "Trying to \"win\" arguments", "Showing appreciation consistently", "Spending money on each other"],
      correctIndex: 2,
      explanation: "Showing genuine appreciation and gratitude keeps love strong and thriving every day."
    },
    {
      id: "q-13",
      question: "What's generally more important during a disagreement?",
      options: ["Proving who is right", "Getting the last word", "Understanding each other's perspective", "Ending the conversation quickly"],
      correctIndex: 2,
      explanation: "Listening to understand each other rather than trying to win is the key to lasting harmony."
    },
    {
      id: "q-14",
      question: "Which is usually considered a healthy sign in a relationship?",
      options: ["Having identical interests", "Never disagreeing", "Being comfortable communicating boundaries", "Constantly needing reassurance"],
      correctIndex: 2,
      explanation: "Being comfortable and safe communicating open boundaries and feelings."
    },
    {
      id: "q-15",
      question: "What tends to make apologies more meaningful?",
      options: ["Saying \"sorry\" repeatedly", "Explaining why you were right", "Taking responsibility and changing the behavior", "Buying a gift"],
      correctIndex: 2,
      explanation: "True accountability and meaningful positive change make an apology heartfelt."
    },

    // ROUND 4 — GENERAL TRIVIA (⭐⭐⭐⭐ Expert)
    {
      id: "q-16",
      question: "Which planet has the shortest day in our Solar System?",
      options: ["Earth", "Mars", "Jupiter", "Mercury"],
      correctIndex: 2,
      explanation: "Jupiter rotates once in just under 10 hours — the fastest spinning planet in our solar system!"
    },
    {
      id: "q-17",
      question: "Which country is credited with inventing modern chocolate bars?",
      options: ["Switzerland", "France", "United Kingdom", "Belgium"],
      correctIndex: 2,
      explanation: "J.S. Fry & Sons in Bristol, United Kingdom created the first modern chocolate bar in 1847!"
    },
    {
      id: "q-18",
      question: "What is the only mammal capable of true sustained flight?",
      options: ["Flying squirrel", "Bat", "Sugar glider", "Colugo"],
      correctIndex: 1,
      explanation: "Bats are the only mammals capable of true powered, sustained flight!"
    },
    {
      id: "q-19",
      question: "Which ocean is the largest?",
      options: ["Atlantic", "Indian", "Pacific", "Southern"],
      correctIndex: 2,
      explanation: "The Pacific Ocean covers over 30% of the Earth's surface — larger than all landmasses combined!"
    },
    {
      id: "q-20",
      question: "Which element has the chemical symbol Au?",
      options: ["Silver", "Gold", "Copper", "Aluminium"],
      correctIndex: 1,
      explanation: "Au comes from the Latin word 'Aurum', meaning shining dawn / gold!"
    },

    // ROUND 5 — \"WAIT... YOU ACTUALLY KNOW THIS?\" (⭐⭐⭐⭐⭐ Master)
    {
      id: "q-21",
      question: "Which number is both a perfect square and a perfect cube?",
      options: ["16", "36", "64", "81"],
      correctIndex: 2,
      explanation: "64 is both 8² (square) and 4³ (cube)!"
    },
    {
      id: "q-22",
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correctIndex: 2,
      explanation: "2 is the smallest prime number (and the only even prime number)!"
    },
    {
      id: "q-23",
      question: "Which language has the most native speakers worldwide?",
      options: ["English", "Spanish", "Mandarin Chinese", "Hindi"],
      correctIndex: 2,
      explanation: "Mandarin Chinese has over 900 million native speakers worldwide!"
    },
    {
      id: "q-24",
      question: "What is the deepest known point in Earth's oceans?",
      options: ["Mariana Trench", "Tonga Trench", "Puerto Rico Trench", "Java Trench"],
      correctIndex: 0,
      explanation: "The Challenger Deep in the Mariana Trench plunges nearly 11,000 meters (36,000 ft) down!"
    },
    {
      id: "q-25",
      question: "Which blood type is commonly known as the universal red-cell donor?",
      options: ["AB+", "O+", "O−", "A−"],
      correctIndex: 2,
      explanation: "O-negative blood lacks A, B, and Rh antigens, making it compatible with all red blood cell recipients!"
    },

    // ROUND 6 — 💀 FINAL ROUND — IMPOSSIBLE MODE (⭐⭐⭐⭐⭐⭐ 50 XP each)
    {
      id: "q-26",
      question: "If you shuffle a standard 52-card deck thoroughly, how likely is it that the exact resulting order has ever existed before?",
      options: ["Very likely", "About 50/50", "Extremely unlikely", "Guaranteed"],
      correctIndex: 2,
      explanation: "52! is ~8 × 10⁶⁷ — virtually every properly shuffled deck is completely unique in the universe! (+50 XP)"
    },
    {
      id: "q-27",
      question: "Which came first?",
      options: ["Sharks", "Trees", "Dinosaurs", "Humans"],
      correctIndex: 0,
      explanation: "Sharks appeared ~450 million years ago, preceding trees by around 50-100 million years! (+50 XP)"
    },
    {
      id: "q-28",
      question: "Which country has the most natural lakes?",
      options: ["Russia", "Canada", "Brazil", "United States"],
      correctIndex: 1,
      explanation: "Canada has over 2 million lakes — more than the rest of the world's natural lakes combined! (+50 XP)"
    },
    {
      id: "q-29",
      question: "What is the approximate speed of light in vacuum?",
      options: ["30,000 km/s", "150,000 km/s", "300,000 km/s", "3,000,000 km/s"],
      correctIndex: 2,
      explanation: "The speed of light in vacuum is approximately 300,000 km/s (299,792 km/s)! (+50 XP)"
    },
    {
      id: "q-30",
      question: "After all these questions, what is the one thing Afiq actually wants Hanna to know?",
      options: [
        "She needs to get more questions right 😂",
        "She owes him a birthday cake",
        "He's proud of how well she knows him",
        "None of these — he just wants her to know how much he loves her."
      ],
      correctIndex: 3,
      explanation: "Afiq loves Hanna beyond all words, through all trivia, now and forever! ❤️👑 (+50 XP)"
    }
  ]
};

export const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  visitedSections: [],
  interactedObjects: [],
  visitedStoryEvents: [],
  gamesWon: [],
  gameHighScores: {},
  gameBestTimes: {},
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
      return { ...INITIAL_PROGRESS };
    }

    const parsed = JSON.parse(data);

    const safeProgress: UserProgress = {
      xp: typeof parsed?.xp === 'number' && !isNaN(parsed.xp) ? Math.max(0, parsed.xp) : 0,
      visitedSections: Array.isArray(parsed?.visitedSections) ? parsed.visitedSections : [],
      interactedObjects: Array.isArray(parsed?.interactedObjects) ? parsed.interactedObjects : [],
      visitedStoryEvents: Array.isArray(parsed?.visitedStoryEvents) ? parsed.visitedStoryEvents : [],
      gamesWon: Array.isArray(parsed?.gamesWon) ? parsed.gamesWon : [],
      gameHighScores: typeof parsed?.gameHighScores === 'object' && parsed?.gameHighScores !== null ? parsed.gameHighScores : {},
      gameBestTimes: typeof parsed?.gameBestTimes === 'object' && parsed?.gameBestTimes !== null ? parsed.gameBestTimes : {},
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

    // Sync story to have the updated Blond Sweater, Roblox, Laptop, and Milestone direct images
    let updatedStory = Array.isArray(parsed.story) ? parsed.story : DEFAULT_CONFIG.story;
    updatedStory = updatedStory.map((s: any) => {
      if (s.id === 'st-1' || s.title?.includes('Spark') || s.title?.includes('Blond')) {
        return {
          ...s,
          id: 'st-1',
          date: 'July 2024',
          title: 'Blond Sweater',
          msg: "The day you gave me this sweater is a moment etched forever in my heart. Wearing it feels like being wrapped in your warmest hug, carrying your love and sweetness everywhere I go. It brought the biggest smile to my face and made me truly, deeply happy.",
          icon: '🧶',
          image: "https://i.postimg.cc/pTQkgWC7/pic1.jpg"
        };
      }
      if (s.id === 'st-2' || s.title?.includes('Jokes') || s.title?.includes('Magical') || s.title?.includes('Roblox')) {
        return {
          ...s,
          id: 'st-2',
          date: 'August 2025',
          title: 'Roblox Adventures',
          msg: "I remember back then when I played Roblox with you, every single moment was pure joy, filled with sweet laughter and cute chaos. Running around virtual worlds hand in hand with you turned simple games into the most precious, unforgettable memories that I cherish so deeply.",
          icon: '🎮',
          image: "https://i.postimg.cc/0QGZLknL/pic2.jpg"
        };
      }
      if (s.id === 'st-3' || s.title?.includes('Drives') || s.title?.includes('Stars') || s.title?.includes('Laptop') || s.title?.includes('Matcha')) {
        return {
          ...s,
          id: 'st-3',
          date: 'August 2024',
          title: 'Call from My Laptop',
          msg: "I still remember those nights when my phone was barely working, so I stayed on video calls with you through my laptop until we both fell asleep. Having your gentle voice and sweet presence by my side made every night feel so comforting and warm. I truly miss those wonderful days and cherish every late night we spent together.",
          icon: '💻',
          image: "https://i.postimg.cc/RF1GjSdb/pic3.jpg"
        };
      }
      if (s.id === 'st-4' || s.title?.includes('Level 23') || s.title?.includes('Chapter 4')) {
        return {
          ...s,
          id: 'st-4',
          date: 'August 2026',
          title: 'Level 23: The Grand Milestone',
          msg: "Celebrating Hanna's royal 23rd birthday! The story is still being written, and the best is yet to come.",
          icon: '👑',
          image: "https://i.postimg.cc/761XpH9d/pic4.jpg"
        };
      }
      return s;
    });

    return { 
      ...DEFAULT_CONFIG, 
      ...parsed, 
      story: updatedStory,
      trivia: DEFAULT_CONFIG.trivia,
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
