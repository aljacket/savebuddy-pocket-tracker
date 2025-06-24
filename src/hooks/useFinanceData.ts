
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
}

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userName, setUserName] = useState<string>('Utente');

  useEffect(() => {
    // Carica dati dal localStorage
    const savedTransactions = localStorage.getItem('savebuddy_transactions');
    const savedGoals = localStorage.getItem('savebuddy_goals');
    const savedChallenges = localStorage.getItem('savebuddy_challenges');
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
      // Inizializza challenges di default
      const defaultChallenges: Challenge[] = [
        {
          id: '1',
          title: 'Spesa Giornaliera',
          description: 'Spendi meno di 10€ al giorno',
          target: 10,
          current: 0,
          type: 'daily',
          badge: '🎯',
          completed: false
        },
        {
          id: '2',
          title: 'Risparmio Settimanale',
          description: 'Risparmia almeno 50€ questa settimana',
          target: 50,
          current: 0,
          type: 'weekly',
          badge: '💎',
          completed: false
        }
      ];
      setChallenges(defaultChallenges);
      localStorage.setItem('savebuddy_challenges', JSON.stringify(defaultChallenges));
    }
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('savebuddy_transactions', JSON.stringify(updatedTransactions));
    
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
  };

  const updateChallenges = (transaction: Transaction) => {
    const today = new Date().toDateString();
    const transactionDate = new Date(transaction.date).toDateString();
    
    if (today === transactionDate && transaction.type === 'expense') {
      const updatedChallenges = challenges.map(challenge => {
        if (challenge.type === 'daily' && challenge.id === '1') {
          const newCurrent = challenge.current + transaction.amount;
          return {
            ...challenge,
            current: newCurrent,
            completed: newCurrent <= challenge.target
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

  return {
    transactions,
    savingsGoals,
    challenges,
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
