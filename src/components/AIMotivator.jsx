import { useState, useEffect, useRef } from "react";
import { getClientMotivation } from "@/lib/client-coach";
import { Card } from "@/components/ui/card";
import { X, Sparkles } from "lucide-react";

export function AIMotivator({ state }) {
  const [quote, setQuote] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const lastRequestTime = useRef(0);

  const updateAI = async () => {
    const now = Date.now();
    // 10-minute cooldown between AI updates to respect quota and prevent spam
    if (now - lastRequestTime.current < 600000) return;

    try {
      lastRequestTime.current = now;
      
      const currentMonth = new Date().getMonth();
      const spentThisMonth = state.transactions
        .filter(t => new Date(t.timestamp).getMonth() === currentMonth && t.type === 'expense')
        .reduce((a, c) => a + c.amount, 0);
      const savedThisMonth = state.transactions
        .filter(t => new Date(t.timestamp).getMonth() === currentMonth && t.type === 'income')
        .reduce((a, c) => a + c.amount, 0);
      
      const res = await getClientMotivation({
        totalBalance: state.totalBalance,
        spentThisMonth,
        savedThisMonth,
        savingRate: Math.round(((state.flexibleSavings + state.lockedSavings) / (state.totalBalance + 0.01)) * 100),
        flexibleSavings: state.flexibleSavings,
        lockedSavings: state.lockedSavings,
        achievementsCount: state.unlockedAchievements.length,
      });
      
      setQuote(res);
      setIsVisible(true);

      // Auto-hide after 15 seconds
      setTimeout(() => setIsVisible(false), 15000);
    } catch (e) {
      // Silently handle errors
      setIsVisible(false);
    }
  };

  useEffect(() => {
    updateAI();
    // Poll every 15 minutes
    const timer = setInterval(updateAI, 900000);
    return () => clearInterval(timer);
  }, [state.unlockedAchievements.length]);

  if (!isVisible || !quote) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 sm:right-auto sm:left-6 z-50 w-auto sm:w-full sm:max-w-[280px] animate-in slide-in-from-left-8 duration-500">
      <Card className="bg-card/95 backdrop-blur-sm border border-border p-5 shadow-xl rounded-2xl relative">
        <button 
          onClick={() => setIsVisible(false)} 
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Coach</span>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm font-bold text-foreground leading-tight tracking-tight">
            "{quote.motivation}"
          </p>
          <div className="h-px bg-border w-full" />
          <div className="bg-muted/30 p-2.5 rounded-lg">
             <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                <span className="font-black text-primary uppercase mr-1">Tip:</span> 
                {quote.tip}
             </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
