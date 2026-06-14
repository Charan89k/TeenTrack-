
"use client";

import { useState, useEffect } from "react";
import { AppState, Transaction, TransactionType, CURRENCIES } from "@/lib/types";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { Expenses } from "@/components/Expenses";
import { Savings } from "@/components/Savings";
import { Analytics } from "@/components/Analytics";
import { CurrencySelector } from "@/components/CurrencySelector";
import { AIMotivator } from "@/components/AIMotivator";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Loading from "./loading";

const INITIAL_STATE: AppState = {
  transactions: [],
  totalBalance: 1250.00,
  flexibleSavings: 200,
  lockedSavings: 500,
  flexibleGoal: 500,
  lockedGoal: 1000,
  lockedUntil: null,
  currency: 'USD',
  unlockedAchievements: ['first_tx'],
};

export default function TeenTrackApp() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Expenses' | 'Savings' | 'Analytics'>('Dashboard');
  const [hydrated, setHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('teenTrackState_v4');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('teenTrackState_v4', JSON.stringify(state));
      checkAchievements();
    }
  }, [state, hydrated]);

  const checkAchievements = () => {
    const newAchievements: string[] = [...state.unlockedAchievements];
    const { transactions, flexibleSavings, lockedSavings, totalBalance } = state;
    
    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const expenseCount = transactions.filter(t => t.type === 'expense').length;

    if (transactions.length > 0 && !newAchievements.includes('first_tx')) newAchievements.push('first_tx');
    if (expenseCount >= 5 && !newAchievements.includes('five_exp')) newAchievements.push('five_exp');
    if (incomeCount >= 3 && !newAchievements.includes('three_inc')) newAchievements.push('three_inc');
    if (flexibleSavings >= 100 && !newAchievements.includes('flex_saver')) newAchievements.push('flex_saver');
    if (lockedSavings >= 100 && !newAchievements.includes('locked_champ')) newAchievements.push('locked_champ');
    if (totalBalance >= 1000 && !newAchievements.includes('balance_keeper')) newAchievements.push('balance_keeper');

    if (newAchievements.length !== state.unlockedAchievements.length) {
      setState(prev => ({ ...prev, unlockedAchievements: newAchievements }));
      toast({
        title: "🏆 Achievement Unlocked",
        description: "Check your progress in the Stats tab.",
      });
    }
  };

  const handleAddTransaction = (amount: number, type: TransactionType, category: string, description: string, date: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      type,
      category,
      description,
      date,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTx],
      totalBalance: type === 'income' ? prev.totalBalance + amount : prev.totalBalance - amount,
    }));

    toast({
      title: type === 'income' ? "Income Added" : "Expense Logged",
      description: type === 'income' ? `+${amount} tracked.` : `-${amount} tracked.`,
    });
  };

  const handleUpdateSavings = (type: 'flex' | 'locked', amount: number, action: 'deposit' | 'withdraw' | 'lock' | 'adjust') => {
    if (isNaN(amount) || amount <= 0) {
      if (action !== 'adjust') return;
    }

    setState(prev => {
      let next = { ...prev };
      const date = new Date().toISOString().split('T')[0];
      const category = type === 'flex' ? 'Flexible Stash' : 'The Vault';

      if (action === 'deposit' || action === 'lock') {
        if (prev.totalBalance < amount) {
          toast({ title: "Insufficient funds", description: "You don't have enough balance.", variant: "destructive" });
          return prev;
        }
        next.totalBalance -= amount;
        if (type === 'flex') next.flexibleSavings += amount;
        else {
          next.lockedSavings += amount;
          next.lockedUntil = Date.now() + (30 * 24 * 60 * 60 * 1000);
        }
        
        // Record deposit as a "Saving" income transaction for the dashboard
        const saveTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          amount,
          type: 'income',
          category: 'Other',
          description: `Saved to ${category}`,
          date,
          timestamp: Date.now(),
        };
        next.transactions = [...next.transactions, saveTx];
        
      } else if (action === 'withdraw') {
        const currentBalance = type === 'flex' ? prev.flexibleSavings : prev.lockedSavings;
        if (currentBalance < amount) {
          toast({ title: "Insufficient savings", description: `Not enough in ${category}.`, variant: "destructive" });
          return prev;
        }
        if (type === 'flex') next.flexibleSavings -= amount;
        else next.lockedSavings -= amount;
        next.totalBalance += amount;
        
        // Record withdrawal as an expense from savings
        const withdrawTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          amount,
          type: 'expense',
          category: 'Other',
          description: `Withdrew from ${category}`,
          date,
          timestamp: Date.now(),
        };
        next.transactions = [...next.transactions, withdrawTx];
        
      } else if (action === 'adjust') {
        if (type === 'flex') next.flexibleSavings = amount;
        else next.lockedSavings = amount;
      }
      return next;
    });

    toast({ title: "Savings Updated", description: "Your balance and activity have been updated." });
  };

  const handleUpdateGoals = (flexibleGoal: number, lockedGoal: number) => {
    setState(prev => ({ ...prev, flexibleGoal, lockedGoal }));
    toast({ title: "Goals Updated", description: "Your savings targets have been saved." });
  };

  const handleUnlock = () => {
    setState(prev => {
      const bonus = prev.lockedSavings * 0.05;
      const totalToBalance = prev.lockedSavings + bonus;
      
      const bonusTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: bonus,
        type: 'income',
        category: 'Other',
        description: "Vault Bonus (5%)",
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
      };

      return {
        ...prev,
        totalBalance: prev.totalBalance + totalToBalance,
        lockedSavings: 0,
        lockedUntil: null,
        transactions: [...prev.transactions, bonusTx]
      };
    });
    toast({ title: "Vault Unlocked", description: "5% bonus has been applied to your balance." });
  };

  const currentSymbol = CURRENCIES.find(c => c.code === state.currency)?.symbol || '$';

  const getSpendLevel = () => {
    const count = state.transactions.filter(t => t.type === 'expense').length;
    if (count > 20) return "Budget Sage";
    if (count > 10) return "Track Star";
    if (count > 3) return "Pro";
    return "Apprentice";
  };

  const getSaveLevel = () => {
    const total = state.flexibleSavings + state.lockedSavings;
    if (total > 1000) return "Wealth Boss";
    if (total > 500) return "Stash Legend";
    if (total > 100) return "Builder";
    return "Starter";
  };

  if (!hydrated) return <Loading />;

  return (
    <main className="min-h-screen max-w-5xl mx-auto pb-24 px-4 sm:px-6">
      <Header spendLevel={getSpendLevel()} saveLevel={getSaveLevel()} />
      <AIMotivator state={state} />
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-8">
        {activeTab === 'Dashboard' && <Dashboard state={state} symbol={currentSymbol} />}
        {activeTab === 'Expenses' && <Expenses state={state} symbol={currentSymbol} onAddTransaction={handleAddTransaction} />}
        {activeTab === 'Savings' && (
          <Savings 
            state={state} 
            symbol={currentSymbol} 
            onUpdateSavings={handleUpdateSavings} 
            onUpdateGoals={handleUpdateGoals}
            onUnlock={handleUnlock} 
          />
        )}
        {activeTab === 'Analytics' && <Analytics state={state} symbol={currentSymbol} />}
      </div>

      <CurrencySelector 
        value={state.currency} 
        onChange={v => setState(prev => ({ ...prev, currency: v }))} 
      />
      <Toaster />
    </main>
  );
}
