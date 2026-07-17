"use client";

import { useEffect, useRef, useState } from "react";
import { AIMotivator } from "@/components/AIMotivator";
import { Analytics } from "@/components/Analytics";
import { CurrencySelector } from "@/components/CurrencySelector";
import { Dashboard } from "@/components/Dashboard";
import { Expenses } from "@/components/Expenses";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Savings } from "@/components/Savings";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { INITIAL_STATE } from "@/lib/default-state";
import { AppState, CURRENCIES, TransactionType } from "@/lib/types";
import Loading from "./loading";
import {
  loadLocalState,
  addLocalTransaction,
  updateLocalSavings,
  updateLocalGoals,
  addLocalCategory,
  updateLocalCategory,
  deleteLocalCategory,
  updateLocalCurrency,
  unlockLocalVault,
} from "@/lib/client-store";

export default function TeenTrackApp() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<"Dashboard" | "Expenses" | "Savings" | "Analytics">("Dashboard");
  const [hydrated, setHydrated] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const achievementsRef = useRef<string[]>([]);
  const { toast } = useToast();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      if (saved === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  useEffect(() => {
    loadLocalState()
      .then((nextState) => {
        achievementsRef.current = nextState.unlockedAchievements;
        setState(nextState);
      })
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : "Unable to load your tracker.");
      })
      .finally(() => setHydrated(true));
  }, []);

  const applyServerState = (nextState: AppState) => {
    const previous = new Set(achievementsRef.current);
    const newlyUnlocked = nextState.unlockedAchievements.filter((id) => !previous.has(id));

    achievementsRef.current = nextState.unlockedAchievements;
    setState(nextState);

    if (newlyUnlocked.length > 0) {
      toast({
        title: "Achievement Unlocked",
        description: "Check your progress in the Stats tab.",
      });
    }
  };

  const runMutation = async (
    request: Promise<AppState>,
    success: { title: string; description: string },
  ) => {
    try {
      const nextState = await request;
      applyServerState(nextState);
      toast(success);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddTransaction = async (
    amount: number,
    type: TransactionType,
    category: string,
    description: string,
    date: string,
  ) => {
    await runMutation(
      addLocalTransaction(state, { amount, type, category, description, date }),
      {
        title: type === "income" ? "Income Added" : "Expense Logged",
        description: type === "income" ? `+${amount} tracked.` : `-${amount} tracked.`,
      },
    );
  };

  const handleUpdateSavings = async (
    type: "flex" | "locked",
    amount: number,
    action: "deposit" | "withdraw" | "lock" | "adjust",
  ) => {
    if (Number.isNaN(amount) || (amount <= 0 && action !== "adjust")) return;

    await runMutation(
      updateLocalSavings(state, { type, amount, action }),
      { title: "Savings Updated", description: "Your balance and activity have been updated." },
    );
  };

  const handleUpdateGoals = async (flexibleGoal: number, lockedGoal: number) => {
    await runMutation(
      updateLocalGoals(state, { flexibleGoal, lockedGoal }),
      { title: "Goals Updated", description: "Your savings targets have been saved." },
    );
  };

  const handleUpdateCategory = async (index: number, newName: string) => {
    await runMutation(
      updateLocalCategory(state, index, { name: newName }),
      { title: "Category Updated", description: "Your dashboard category was renamed." },
    );
  };

  const handleAddCategory = async () => {
    await runMutation(
      addLocalCategory(state),
      { title: "Category Added", description: "You can rename it by clicking the edit icon." },
    );
  };

  const handleDeleteCategory = async (index: number) => {
    await runMutation(
      deleteLocalCategory(state, index),
      { title: "Category Deleted", description: "The category has been removed from your dashboard." },
    );
  };

  const handleUnlock = async () => {
    await runMutation(
      unlockLocalVault(state),
      { title: "Vault Unlocked", description: "5% bonus has been applied to your balance." },
    );
  };

  const handleCurrencyChange = async (currency: string) => {
    await runMutation(
      updateLocalCurrency(state, { currency }),
      { title: "Currency Updated", description: "Your display currency has been saved." },
    );
  };

  const currentSymbol = CURRENCIES.find((currency) => currency.code === state.currency)?.symbol || "Rs";

  const getSpendLevel = () => {
    const count = state.transactions.filter((transaction) => transaction.type === "expense").length;
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

  if (loadError) {
    return (
      <main className="min-h-screen max-w-5xl mx-auto pb-24 px-4 sm:px-6 flex items-center justify-center">
        <div className="flat-card bg-card border border-border rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-xl font-extrabold mb-2">TeenTrack could not start</h1>
          <p className="text-sm text-muted-foreground font-medium">{loadError}</p>
        </div>
        <Toaster />
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto pb-24 px-4 sm:px-6">
      <Header spendLevel={getSpendLevel()} saveLevel={getSaveLevel()} theme={theme} onToggleTheme={toggleTheme} />
      <AIMotivator state={state} />

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-8">
        {activeTab === "Dashboard" && (
          <Dashboard
            state={state}
            symbol={currentSymbol}
            onUpdateCategory={handleUpdateCategory}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
        {activeTab === "Expenses" && (
          <Expenses
            state={state}
            symbol={currentSymbol}
            onAddTransaction={handleAddTransaction}
          />
        )}
        {activeTab === "Savings" && (
          <Savings
            state={state}
            symbol={currentSymbol}
            onUpdateSavings={handleUpdateSavings}
            onUpdateGoals={handleUpdateGoals}
            onUnlock={handleUnlock}
          />
        )}
        {activeTab === "Analytics" && <Analytics state={state} symbol={currentSymbol} />}
      </div>

      <CurrencySelector value={state.currency} onChange={handleCurrencyChange} />
      <Toaster />
    </main>
  );
}
