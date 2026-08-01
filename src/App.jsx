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
import { CURRENCIES } from "@/lib/types";
import Loading from "@/components/Loading";
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

export default function App() {
  const [state, setState] = useState(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [hydrated, setHydrated] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const achievementsRef = useRef([]);
  const { toast } = useToast();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
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

  const applyServerState = (nextState) => {
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
    request,
    success,
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
    amount,
    type,
    category,
    description,
    date,
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
    type,
    amount,
    action,
  ) => {
    if (Number.isNaN(amount) || (amount <= 0 && action !== "adjust")) return;

    await runMutation(
      updateLocalSavings(state, { type, amount, action }),
      { title: "Savings Updated", description: "Your balance and activity have been updated." },
    );
  };

  const handleUpdateGoals = async (flexibleGoal, lockedGoal) => {
    await runMutation(
      updateLocalGoals(state, { flexibleGoal, lockedGoal }),
      { title: "Goals Updated", description: "Your savings targets have been saved." },
    );
  };

  const handleUpdateCategory = async (index, newName) => {
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

  const handleDeleteCategory = async (index) => {
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

  const handleCurrencyChange = async (currency) => {
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

  if (!hydrated || !loadingComplete) {
    return <Loading onComplete={() => setLoadingComplete(true)} />;
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md rounded-2xl bg-card p-6 border border-border shadow-xl">
          <h2 className="text-xl font-bold text-red-600">Error Loading Budget</h2>
          <p className="mt-2 text-muted-foreground">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-lg bg-primary py-2 px-4 font-bold text-white transition-all hover:bg-primary/95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background pb-28 text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <Header
          spendLevel={getSpendLevel()}
          saveLevel={getSaveLevel()}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="w-full pt-4">
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
        </main>
      </div>

      <AIMotivator state={state} />

      <CurrencySelector currency={state.currency} onCurrencyChange={handleCurrencyChange} />
      
      <Toaster />
    </div>
  );
}
