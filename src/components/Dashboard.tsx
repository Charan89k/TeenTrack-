
"use client";

import { CATEGORY_EMOJIS, CATEGORIES, AppState } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils-finance";

export function Dashboard({ state, symbol }: { state: AppState; symbol: string }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = state.transactions.filter(t => {
    const d = new Date(t.timestamp);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlySpent = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlySaved = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const categoryTotals = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = state.transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card rainbow-shimmer p-8 flex flex-col items-center justify-center text-center">
          <p className="text-white/70 font-medium mb-2">Total Balance</p>
          <h2 className="text-5xl font-bold text-glow font-headline">
            {formatCurrency(state.totalBalance, symbol)}
          </h2>
        </Card>

        <Card className="glass-card rainbow-shimmer p-8 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p className="text-white/70 text-sm font-medium">Monthly Spent</p>
            <p className="text-2xl font-bold text-coral-400">
              {formatCurrency(monthlySpent, symbol)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-white/70 text-sm font-medium">Monthly Saved</p>
            <p className="text-2xl font-bold text-teal-400">
              {formatCurrency(monthlySaved, symbol)}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Card key={cat} className="glass-card shine-sweep p-6 flex flex-col items-center group hover:scale-105 transition-transform cursor-pointer">
            <span className="text-4xl mb-3 group-hover:bouncing-emoji transition-transform">
              {CATEGORY_EMOJIS[cat]}
            </span>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{cat}</p>
            <p className="text-xl font-bold mt-1">
              {formatCurrency(categoryTotals[cat] || 0, symbol)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
