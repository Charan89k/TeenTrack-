"use client";

import { CATEGORY_EMOJIS, CATEGORIES, AppState } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils-finance";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 flat-card p-8 flex flex-col justify-center">
          <p className="text-muted-foreground font-medium text-sm mb-1 uppercase tracking-wider">Total Balance</p>
          <h2 className="text-5xl font-extrabold tracking-tight text-foreground">
            {formatCurrency(state.totalBalance, symbol)}
          </h2>
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 bg-green-50 text-green-600 rounded-full">
              <ArrowUpRight className="w-4 h-4" />
              {formatCurrency(monthlySaved, symbol)} incoming
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 bg-red-50 text-red-600 rounded-full">
              <ArrowDownRight className="w-4 h-4" />
              {formatCurrency(monthlySpent, symbol)} outgoing
            </div>
          </div>
        </Card>

        <Card className="flat-card p-8 bg-primary text-white flex flex-col justify-between">
          <div>
            <p className="text-white/70 font-medium text-sm uppercase tracking-wider mb-2">Saved this Month</p>
            <h3 className="text-4xl font-bold">{formatCurrency(monthlySaved, symbol)}</h3>
          </div>
          <p className="text-sm text-white/60 mt-4 leading-relaxed">
            You're saving 24% more than last month. Keep it up!
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <Card key={cat} className="flat-card p-6 group hover:border-primary/50 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl p-2 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                {CATEGORY_EMOJIS[cat]}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{cat}</span>
            </div>
            <p className="text-xl font-extrabold text-foreground">
              {formatCurrency(categoryTotals[cat] || 0, symbol)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}