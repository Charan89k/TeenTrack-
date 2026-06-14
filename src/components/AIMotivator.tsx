
"use client";

import { useState, useEffect } from "react";
import { AppState, CATEGORIES } from "@/lib/types";
import { teenTrackAIMotivator } from "@/ai/flows/teen-track-ai-motivator-flow";
import { Card } from "@/components/ui/card";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIMotivator({ state }: { state: AppState }) {
  const [quote, setQuote] = useState<{ motivation: string; tip: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const updateAI = async () => {
    try {
      const currentMonth = new Date().getMonth();
      const spentThisMonth = state.transactions
        .filter(t => new Date(t.timestamp).getMonth() === currentMonth && t.type === 'expense')
        .reduce((a, c) => a + c.amount, 0);
      const savedThisMonth = state.transactions
        .filter(t => new Date(t.timestamp).getMonth() === currentMonth && t.type === 'income')
        .reduce((a, c) => a + c.amount, 0);
      
      const res = await teenTrackAIMotivator({
        totalBalance: state.totalBalance,
        spentThisMonth,
        savedThisMonth,
        savingRate: (state.flexibleSavings + state.lockedSavings) / (state.totalBalance + 1) * 100,
        flexibleSavings: state.flexibleSavings,
        lockedSavings: state.lockedSavings,
        achievementsUnlocked: state.unlockedAchievements,
      });
      setQuote(res);
      setIsVisible(true);

      // Auto hide after 8 seconds
      setTimeout(() => setIsVisible(false), 8000);
    } catch (e) {
      console.error("AI error", e);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateAI();
    }, 15000);
    
    // Initial call
    updateAI();

    return () => clearInterval(timer);
  }, []);

  if (!quote || !isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-full max-w-[320px] animate-in slide-in-from-right-full duration-500">
      <Card className="glass-card rainbow-shimmer p-4 relative shadow-2xl">
        <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 text-white/50 hover:text-white">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">AI Money Guru</span>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold italic text-glow leading-tight">"{quote.motivation}"</p>
          <div className="h-px bg-white/10 w-full" />
          <p className="text-[11px] text-white/80"><span className="font-bold text-teal-400">TIP:</span> {quote.tip}</p>
        </div>
      </Card>
    </div>
  );
}
