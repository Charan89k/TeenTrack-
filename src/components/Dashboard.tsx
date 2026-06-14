
"use client";

import { useState } from "react";
import { CATEGORY_EMOJIS, CATEGORIES, AppState } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils-finance";
import { ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ViewCriteria = "month" | "all";

export function Dashboard({ state, symbol }: { state: AppState; symbol: string }) {
  const [criteria, setCriteria] = useState<ViewCriteria>("month");

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const filteredTransactions = state.transactions.filter(t => {
    if (criteria === "all") return true;
    const d = new Date(t.timestamp);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSaved = filteredTransactions
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
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-extrabold tracking-tight">Overview</h3>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={criteria} onValueChange={(v: ViewCriteria) => setCriteria(v)}>
            <SelectTrigger className="w-[140px] h-9 rounded-full bg-white border-border text-xs font-bold uppercase tracking-wider">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="month" className="text-xs font-bold">This Month</SelectItem>
              <SelectItem value="all" className="text-xs font-bold">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 flat-card p-8 flex flex-col justify-center">
          <p className="text-muted-foreground font-medium text-sm mb-1 uppercase tracking-wider">Total Balance</p>
          <h2 className="text-5xl font-extrabold tracking-tight text-foreground">
            {formatCurrency(state.totalBalance, symbol, state.currency)}
          </h2>
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 bg-green-50 text-green-600 rounded-full">
              <ArrowUpRight className="w-4 h-4" />
              {formatCurrency(totalSaved, symbol, state.currency)} {criteria === "month" ? "this month" : "total"}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 bg-red-50 text-red-600 rounded-full">
              <ArrowDownRight className="w-4 h-4" />
              {formatCurrency(totalSpent, symbol, state.currency)} {criteria === "month" ? "this month" : "total"}
            </div>
          </div>
        </Card>

        <Card className="flat-card p-8 bg-primary text-white flex flex-col justify-between">
          <div>
            <p className="text-white/70 font-medium text-sm uppercase tracking-wider mb-2">Saved {criteria === "month" ? "This Month" : "Total"}</p>
            <h3 className="text-4xl font-bold">
              {formatCurrency(
                criteria === "all" ? (state.flexibleSavings + state.lockedSavings) : totalSaved, 
                symbol, 
                state.currency
              )}
            </h3>
          </div>
          <p className="text-sm text-white/60 mt-4 leading-relaxed">
            {criteria === "month" 
              ? "Your saving rate is up 24% from last month. Keep it up!" 
              : "Consistently tracking your income builds massive wealth habits."}
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
              {formatCurrency(categoryTotals[cat] || 0, symbol, state.currency)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
