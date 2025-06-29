import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: 'daily' | 'weekly' | 'monthly';
  badge: string;
  completed: boolean;
  xpReward: number;
  category: 'spending' | 'saving' | 'investment' | 'education';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  unlocked: boolean;
  unlockedDate?: string;
  xpReward: number;
  requirement: {
    type: 'transactions' | 'savings' | 'streak' | 'challenges';
    target: number;
  };
}

export interface UserProfile {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  avatar: string;
  title: string;
}

const CHALLENGES_TEMPLATES = [
  {
    id: 'daily_budget',
    title: 'Budget Giornaliero',
    description: 'Spendi meno di €20 oggi',
    target: 20,
    type: 'daily' as const,
    badge: '🎯',
    xpReward: 10,
    category: 'spending' as const
  },
  {
    id: 'coffee_saver',
    title: 'Coffee Saver',
    description: 'Evita di comprare caffè fuori per 3 giorni',
    target: 3,
    type: 'weekly' as const,
    badge: '☕',
    xpReward: 25,
    category: 'saving' as const
  },
  {
    id: 'grocery_hero',
    title: 'Grocery Hero',
    description: 'Spendi meno di €50 per alimentari questa settimana',
    target: 50,
    type: 'weekly' as const,
    badge: '🛒',
    xpReward: 30,
    category: 'spending' as const
  },
  {
    id: 'savings_champion',
    title: 'Savings Champion',
    description: 'Risparmia almeno €100 questo mese',
    target: 100,
    type: 'monthly' as const,
    badge: '💎',
    xpReward: 50,
    category: 'saving' as const
  },
  {
    id: 'transaction_tracker',
    title: 'Tracker Master',
    description: 'Registra almeno 10 transazioni questa settimana',
    target: 10,
    type: 'weekly' as const,
    badge: '📊',
    xpReward: 20,
    category: 'education' as const
  }
];

const ACHIEVEMENTS_TEMPLATES: Achievement[] = [
  {
    id: 'first_transaction',
    title: 'Primo Passo',
    description: 'Registra la tua prima transazione',
    badge: '🌟',
    unlocked: false,
    xpReward: 15,
    requirement: { type: 'transactions', target: 1 }
  },
  {
    id: 'transaction_master',
    title: 'Transaction Master',
    description: 'Registra 100 transazioni',
    badge: '🏆',
    unlocked: false,
    xpReward: 100,
    requirement: { type: 'transactions', target: 100 }
  },
  {
    id: 'savings_starter',
    title: 'Savings Starter',
    description: 'Crea il tuo primo obiettivo di risparmio',
    badge: '💰',
    unlocked: false,
    xpReward: 20,
    requirement: { type: 'savings', target: 1 }
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Mantieni una streak di 30 giorni',
    badge: '🔥',
    unlocked: false,
    xpReward: 75,
    requirement: { type: 'streak', target: 30 }
  },
  {
    id: 'challenge_conqueror',
    title: 'Challenge Conqueror',
    description: 'Completa 10 challenge',
    badge: '⚡',
    unlocked: false,
    xpReward: 80,
    requirement: { type: 'challenges', target: 10 }
  }
];

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXp: 0,
    streak: 0,
    longestStreak: 0,
    avatar: '👤',
    title: 'Principiante'
  });
  const [userName, setUserName] = useState<string>('Utente');

  // Calcola livello e XP per il prossimo livello
  const calculateLevel = (totalXp: number) => {
    const level = Math.floor(totalXp / 100) + 1;
    const xpToNextLevel = (level * 100) - totalXp;
    return { level, xpToNextLevel };
  };

  // Genera challenge dinamiche
  const generateWeeklyChallenges = () => {
    const currentWeek = new Date().getWeek();
    const savedWeek = localStorage.getItem('savebuddy_current_week');
    
    if (savedWeek !== currentWeek.toString()) {
      // Nuova settimana, genera nuove challenge
      const shuffled = [...CHALLENGES_TEMPLATES].sort(() => 0.5 - Math.random());
      const weeklyChallenge = shuffled.slice(0, 3).map((template, index) => ({
        ...template,
        id: `${template.id}_${currentWeek}_${index}`,
        current: 0,
        completed: false
      }));
      
      setChallenges(prev => [...prev.filter(c => c.type !== 'weekly'), ...weeklyChallenge]);
      localStorage.setItem('savebuddy_current_week', currentWeek.toString());
    }
  };

  // Aggiorna achievements
  const checkAchievements = () => {
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let currentProgress = 0;
      switch (achievement.requirement.type) {
        case 'transactions':
          currentProgress = transactions.length;
          break;
        case 'savings':
          currentProgress = savingsGoals.length;
          break;
        case 'streak':
          currentProgress = userProfile.streak;
          break;
        case 'challenges':
          currentProgress = challenges.filter(c => c.completed).length;
          break;
      }

      if (currentProgress >= achievement.requirement.target) {
        const newAchievement = {
          ...achievement,
          unlocked: true,
          unlockedDate: new Date().toISOString()
        };
        
        // Aggiungi XP per achievement
        setUserProfile(prev => {
          const newTotalXp = prev.totalXp + achievement.xpReward;
          const { level, xpToNextLevel } = calculateLevel(newTotalXp);
          return {
            ...prev,
            xp: prev.xp + achievement.xpReward,
            totalXp: newTotalXp,
            level,
            xpToNextLevel,
            title: level >= 5 ? 'Esperto' : level >= 3 ? 'Intermedio' : 'Principiante'
          };
        });

        return newAchievement;
      }

      return achievement;
    });

    if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
      setAchievements(updatedAchievements);
      localStorage.setItem('savebuddy_achievements', JSON.stringify(updatedAchievements));
    }
  };

  useEffect(() => {
    // Carica dati dal localStorage
    const savedTransactions = localStorage.getItem('savebuddy_transactions');
    const savedGoals = localStorage.getItem('savebuddy_goals');
    const savedChallenges = localStorage.getItem('savebuddy_challenges');
    const savedAchievements = localStorage.getItem('savebuddy_achievements');
    const savedProfile = localStorage.getItem('savebuddy_profile');
    const savedUserName = localStorage.getItem('savebuddy_username');

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedGoals) {
      setSavingsGoals(JSON.parse(savedGoals));
    }
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    } else {
      // Inizializza con challenge template
      const initialChallenges = CHALLENGES_TEMPLATES.slice(0, 3).map(template => ({
        ...template,
        current: 0,
        completed: false
      }));
      setChallenges(initialChallenges);
    }
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      setAchievements(ACHIEVEMENTS_TEMPLATES);
    }
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    if (savedUserName) {
      setUserName(savedUserName);
    }

    // Genera challenge settimanali
    generateWeeklyChallenges();
  }, []);

  useEffect(() => {
    checkAchievements();
  }, [transactions, savingsGoals, challenges, userProfile.streak, checkAchievements]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('savebuddy_transactions', JSON.stringify(updatedTransactions));
    
    // Aggiorna XP e streak
    setUserProfile(prev => {
      const newXp = prev.xp + 5; // 5 XP per ogni transazione
      const newTotalXp = prev.totalXp + 5;
      const { level, xpToNextLevel } = calculateLevel(newTotalXp);
      
      return {
        ...prev,
        xp: newXp,
        totalXp: newTotalXp,
        level,
        xpToNextLevel,
        streak: prev.streak + 1,
        longestStreak: Math.max(prev.longestStreak, prev.streak + 1)
      };
    });
    
    // Aggiorna le challenge
    updateChallenges(newTransaction);
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString()
    };
    const updatedGoals = [...savingsGoals, newGoal];
    setSavingsGoals(updatedGoals);
    localStorage.setItem('savebuddy_goals', JSON.stringify(updatedGoals));

    // XP per creare obiettivo
    setUserProfile(prev => {
      const newXp = prev.xp + 15;
      const newTotalXp = prev.totalXp + 15;
      const { level, xpToNextLevel } = calculateLevel(newTotalXp);
      
      return {
        ...prev,
        xp: newXp,
        totalXp: newTotalXp,
        level,
        xpToNextLevel
      };
    });
  };

  const updateChallenges = (transaction: Transaction) => {
    const today = new Date().toDateString();
    const transactionDate = new Date(transaction.date).toDateString();
    
    if (today === transactionDate) {
      const updatedChallenges = challenges.map(challenge => {
        if (challenge.completed) return challenge;

        let shouldUpdate = false;
        let newCurrent = challenge.current;

        // Logic per diversi tipi di challenge
        switch (challenge.id.split('_')[0]) {
          case 'daily':
            if (transaction.type === 'expense') {
              newCurrent = challenge.current + transaction.amount;
              shouldUpdate = true;
            }
            break;
          case 'transaction':
            newCurrent = challenge.current + 1;
            shouldUpdate = true;
            break;
          case 'grocery':
            if (transaction.category === 'Alimentari' && transaction.type === 'expense') {
              newCurrent = challenge.current + transaction.amount;
              shouldUpdate = true;
            }
            break;
        }

        if (shouldUpdate) {
          const completed = newCurrent >= challenge.target;
          if (completed && !challenge.completed) {
            // Aggiungi XP per challenge completata
            setUserProfile(prev => {
              const newXp = prev.xp + challenge.xpReward;
              const newTotalXp = prev.totalXp + challenge.xpReward;
              const { level, xpToNextLevel } = calculateLevel(newTotalXp);
              
              return {
                ...prev,
                xp: newXp,
                totalXp: newTotalXp,
                level,
                xpToNextLevel
              };
            });
          }

          return {
            ...challenge,
            current: newCurrent,
            completed
          };
        }
        return challenge;
      });
      
      setChallenges(updatedChallenges);
      localStorage.setItem('savebuddy_challenges', JSON.stringify(updatedChallenges));
    }
  };

  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
  };

  // Salva profile ogni volta che cambia
  useEffect(() => {
    localStorage.setItem('savebuddy_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  return {
    transactions,
    savingsGoals,
    challenges,
    achievements,
    userProfile,
    userName,
    addTransaction,
    addSavingsGoal,
    getMonthlyStats,
    setUserName: (name: string) => {
      setUserName(name);
      localStorage.setItem('savebuddy_username', name);
    }
  };
};

// Utility per calcolare la settimana
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function() {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};
