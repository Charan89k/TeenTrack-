"use client";

import { useState, useEffect } from "react";
import { AppState } from "@/lib/types";
import { teenTrackAIMotivator } from "@/ai/flows/teen-track-ai-motivator-flow";
import { Card } from "@/components/ui/card";
import { X, Sparkles } from "lucide-react";

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
        savingRate: Math.round(((state.flexibleSavings + state.lockedSavings) / (state.totalBalance + 1)) * 100),
        flexibleSavings: state.flexibleSavings,
        lockedSavings: state.lockedSavings,
        achievementsUnlocked: state.unlockedAchievements,
      });
      setQuote(res);
      setIsVisible(true);

      setTimeout(() => setIsVisible(false), 10000);
    } catch (e) {
      console.error("AI Assistant error", e);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateAI();
    }, 45000);
    
    updateAI();
    return () => clearInterval(timer);
  }, []);

  if (!quote || !isVisible) return null;

  return (
    <div className="fixed top-24 right-6 z-50 w-full max-w-[340px] animate-in slide-in-from-right-8 duration-500">
      <Card className="bg-white border-2 border-primary/20 p-6 shadow-2xl rounded-3xl relative">
        <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Financial Coach</span>
        </div>
        <div className="space-y-4">
          <p className="text-md font-bold text-foreground leading-tight tracking-tight">"{quote.motivation}"</p>
          <div className="h-px bg-border w-full" />
          <div className="bg-muted/50 p-3 rounded-xl">
             <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
               <span className="font-black text-primary uppercase mr-1">Pro Tip:</span> 
               {quote.tip}
             </p>
          </div>
        </div>
      </Card>
    </div>
  );
}