
"use client";

import { AppState, CATEGORY_EMOJIS } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatCurrency, getAutoEmoji } from "@/lib/utils-finance";
import { Award, TrendingUp, Calendar, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

const ACHIEVEMENTS = [
  { id: 'first_tx', title: 'Starter', desc: 'Log your first transaction', icon: '🎯' },
  { id: 'five_exp', title: 'Tracker', desc: '5 Expenses logged', icon: '💸' },
  { id: 'three_inc', title: 'Earner', desc: '3 Income sources', icon: '💰' },
  { id: 'flex_saver', title: 'Stasher', desc: 'Save $100 in Stash', icon: '💎' },
  { id: 'locked_champ', title: 'Disciplined', desc: 'Save $100 in Vault', icon: '🔒' },
  { id: 'balance_keeper', title: 'Wealthy', desc: 'Balance over $1,000', icon: '👑' },
];

export function Analytics({ state, symbol }: { state: AppState; symbol: string }) {
  const totalSpent = state.transactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
  const totalSaved = state.flexibleSavings + state.lockedSavings;
  
  const oldestDate = state.transactions.length > 0 ? Math.min(...state.transactions.map(t => t.timestamp)) : Date.now();
  const daysTracked = Math.max(1, Math.ceil((Date.now() - oldestDate) / (1000 * 60 * 60 * 24)));
  const dailyAvg = totalSpent / daysTracked;

  const cats = state.categories.map(cat => ({
    cat,
    total: state.transactions.filter(t => t.category === cat).reduce((a, c) => a + c.amount, 0)
  })).sort((a, b) => b.total - a.total);
  const topCat = cats[0]?.total > 0 ? cats[0].cat : '—';

  const savingRate = (totalSaved / (totalSpent + totalSaved + 0.01)) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flat-card p-6 flex flex-col items-center justify-center text-center">
          <Calendar className="w-5 h-5 text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Daily Spend</p>
          <p className="text-2xl font-black mt-1">{formatCurrency(dailyAvg, symbol, state.currency)}</p>
        </Card>
        <Card className="flat-card p-6 flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-5 h-5 text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Top Cat</p>
          <p className="text-2xl font-black mt-1">{topCat !== '—' ? `${getAutoEmoji(topCat)} ${topCat}` : topCat}</p>
        </Card>
        <Card className="flat-card p-6 flex flex-col items-center justify-center text-center">
          <Hash className="w-5 h-5 text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Savings Rate</p>
          <p className="text-2xl font-black mt-1 text-primary">{savingRate.toFixed(1)}%</p>
        </Card>
        <Card className="flat-card p-6 flex flex-col items-center justify-center text-center">
          <Award className="w-5 h-5 text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Rewards</p>
          <p className="text-2xl font-black mt-1">{state.unlockedAchievements.length} / 6</p>
        </Card>
      </div>

      <Card className="flat-card p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-extrabold tracking-tight">Milestones</h3>
          <p className="text-sm font-bold text-muted-foreground">{state.unlockedAchievements.length} unlocked</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = state.unlockedAchievements.includes(ach.id);
            return (
              <div key={ach.id} className={cn(
                "p-6 rounded-2xl border transition-all duration-300",
                isUnlocked 
                  ? "bg-white border-primary shadow-sm ring-1 ring-primary/20" 
                  : "bg-muted/30 border-dashed border-muted-foreground/20 opacity-60 grayscale"
              )}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{ach.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{ach.title}</h4>
                    <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">{ach.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
