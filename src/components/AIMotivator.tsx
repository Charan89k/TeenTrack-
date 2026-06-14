"use client";

import { useState, useEffect, useRef } from "react";
import { AppState } from "@/lib/types";
import { teenTrackAIMotivator } from "@/ai/flows/teen-track-ai-motivator-flow";
import { Card } from "@/components/ui/card";
import { X, Sparkles, AlertCircle } from "lucide-react";

export function AIMotivator({ state }: { state: AppState }) {
  const [quote, setQuote] = useState<{ motivation: string; tip: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRequestTime = useRef<number>(0);

  const updateAI = async () => {
    // Prevent spamming if already visible or if called too recently (cooldown 2 minutes)
    const now = Date.now();
    if (now - lastRequestTime.current < 120000) return;

    try {
      lastRequestTime.current = now;
      setError(null);
      
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

      // Auto-hide after 15 seconds to keep the UI clean
      setTimeout(() => setIsVisible(false), 15000);
    } catch (e: any) {
      console.warn("AI Assistant quota or fetch error:", e);
      // Don't show technical errors to Gen Z users, just keep it quiet or show a subtle alert
      if (e.message?.includes('429') || e.message?.includes('quota')) {
        setError("Coach is busy. Try again later.");
      }
    }
  };

  useEffect(() => {
    // Fetch once on mount
    updateAI();
    
    // Poll significantly less frequently (every 10 minutes) to respect API limits
    const timer = setInterval(() => {
      updateAI();
    }, 600000);
    
    return () => clearInterval(timer);
  }, []);

  if (!isVisible && !error) return null;

  return (
    <div className="fixed top-24 right-6 z-50 w-full max-w-[340px] animate-in slide-in-from-right-8 duration-500">
      <Card className="bg-white border border-border p-6 shadow-xl rounded-3xl relative">
        <button 
          onClick={() => {
            setIsVisible(false);
            setError(null);
          }} 
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        {error ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <p className="text-xs font-semibold">{error}</p>
          </div>
        ) : quote && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Financial Coach</span>
            </div>
            <div className="space-y-4">
              <p className="text-md font-bold text-foreground leading-tight tracking-tight">"{quote.motivation}"</p>
              <div className="h-px bg-border w-full" />
              <div className="bg-muted/30 p-3 rounded-xl">
                 <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                   <span className="font-black text-primary uppercase mr-1">Pro Tip:</span> 
                   {quote.tip}
                 </p>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}