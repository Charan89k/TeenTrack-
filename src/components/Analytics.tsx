
"use client";

import { AppState, CATEGORY_EMOJIS, CATEGORIES } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils-finance";

const ACHIEVEMENTS = [
  { id: 'first_tx', title: '🎯 First Transaction!', desc: 'Logged your very first activity.', icon: '🎯' },
  { id: 'five_exp', title: '💸 5 Expenses Tracked!', desc: 'Keeping a close eye on your spending.', icon: '💸' },
  { id: 'three_inc', title: '💰 3 Income Sources!', desc: 'Diversifying your wealth!', icon: '💰' },
  { id: 'flex_saver', title: '💰 $100 Flexible Saver!', desc: 'Building a rainy day fund.', icon: '💰' },
  { id: 'locked_champ', title: '🔒 Locked Savings Champion!', desc: 'Reached $100 in the Vault.', icon: '🔒' },
  { id: 'balance_keeper', title: '💎 Balance Keeper!', desc: 'Total balance over $1000!', icon: '💎' },
];

export function Analytics({ state, symbol }: { state: AppState; symbol: string }) {
  const totalSpent = state.transactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
  const totalSaved = state.flexibleSavings + state.lockedSavings;
  const incomeCount = state.transactions.filter(t => t.type === 'income').length;
  
  // Daily Average
  const oldestDate = state.transactions.length > 0 ? Math.min(...state.transactions.map(t => t.timestamp)) : Date.now();
  const daysTracked = Math.max(1, Math.ceil((Date.now() - oldestDate) / (1000 * 60 * 60 * 24)));
  const dailyAvg = totalSpent / daysTracked;

  // Top Category
  const cats = CATEGORIES.map(cat => ({
    cat,
    total: state.transactions.filter(t => t.category === cat).reduce((a, c) => a + c.amount, 0)
  })).sort((a, b) => b.total - a.total);
  const topCat = cats[0]?.total > 0 ? cats[0].cat : 'None yet';

  // Saving Rate
  const savingRate = (totalSaved / (totalSpent + totalSaved + 1)) * 100;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6 text-center space-y-2">
          <p className="text-white/60 text-sm">Daily Average Spend</p>
          <p className="text-3xl font-bold">{formatCurrency(dailyAvg, symbol)}</p>
        </Card>
        <Card className="glass-card p-6 text-center space-y-2">
          <p className="text-white/60 text-sm">Top Category</p>
          <p className="text-2xl font-bold">{topCat !== 'None yet' ? `${CATEGORY_EMOJIS[topCat]} ${topCat}` : topCat}</p>
        </Card>
        <Card className="glass-card p-6 text-center space-y-2">
          <p className="text-white/60 text-sm">Saving Rate</p>
          <p className="text-3xl font-bold text-teal-400">{savingRate.toFixed(1)}%</p>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>🏆 Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map(ach => {
              const isUnlocked = state.unlockedAchievements.includes(ach.id);
              return (
                <div key={ach.id} className={`p-4 rounded-xl border transition-all duration-500 ${isUnlocked ? 'glass-card bg-white/10 border-white/20' : 'bg-black/20 border-white/5 opacity-40 grayscale'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ach.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm">{ach.title}</h4>
                      <p className="text-xs text-white/60">{ach.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
