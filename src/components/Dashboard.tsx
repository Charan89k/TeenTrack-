
"use client";

import { useState } from "react";
import { AppState } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatCurrency, getAutoEmoji } from "@/lib/utils-finance";
import { ArrowUpRight, ArrowDownRight, Filter, PencilLine, Check, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type ViewCriteria = "month" | "all";

interface DashboardProps {
  state: AppState;
  symbol: string;
  onUpdateCategory: (index: number, newName: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (index: number) => void;
}

export function Dashboard({ state, symbol, onUpdateCategory, onAddCategory, onDeleteCategory }: DashboardProps) {
  const [criteria, setCriteria] = useState<ViewCriteria>("month");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

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

  // For the "Saved" card, we specifically want to track money entering stashes
  const totalStashDeposits = filteredTransactions
    .filter(t => t.type === 'income' && (t.description.includes('Saved to') || t.description.includes('Vault')))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // All-time total stash deposits
  const allTimeStashDeposits = state.transactions
    .filter(t => t.type === 'income' && (t.description.includes('Saved to') || t.description.includes('Vault')))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income' && !t.description.includes('Saved to') && !t.description.includes('Vault'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const categoryTotals = state.categories.reduce((acc, cat) => {
    acc[cat] = filteredTransactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  const handleStartEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) {
      onUpdateCategory(index, editValue.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-extrabold tracking-tight">Overview</h3>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={criteria} onValueChange={(v: ViewCriteria) => setCriteria(v)}>
            <SelectTrigger className="w-[140px] h-9 rounded-full bg-white border-border text-xs font-bold uppercase tracking-wider focus:ring-primary/20">
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
              {formatCurrency(totalIncome, symbol, state.currency)} {criteria === "month" ? "income" : "total income"}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 bg-red-50 text-red-600 rounded-full">
              <ArrowDownRight className="w-4 h-4" />
              {formatCurrency(totalSpent, symbol, state.currency)} {criteria === "month" ? "spent" : "total spent"}
            </div>
          </div>
        </Card>

        <Card className="flat-card p-8 bg-primary text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-white/70 font-medium text-sm uppercase tracking-wider mb-2">Saved {criteria === "month" ? "This Month" : "Total"}</p>
            <h3 className="text-4xl font-bold">
              {formatCurrency(
                criteria === "all" ? allTimeStashDeposits : totalStashDeposits, 
                symbol, 
                state.currency
              )}
            </h3>
          </div>
          <p className="text-sm text-white/60 mt-4 leading-relaxed relative z-10">
            {criteria === "month" 
              ? "This reflects actual money moved into your stashes." 
              : "Every deposit brings you closer to your financial goals."}
          </p>
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {state.categories.map((cat, index) => {
          const isEditing = editingIndex === index;
          return (
            <Card key={index} className="flat-card p-6 group hover:border-primary/50 relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl p-2 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                  {getAutoEmoji(isEditing ? editValue : cat)}
                </span>
                <div className="flex gap-1">
                  {!isEditing ? (
                    <>
                      <button 
                        onClick={() => handleStartEdit(index, cat)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-muted rounded-full text-muted-foreground"
                      >
                        <PencilLine className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onDeleteCategory(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 hover:text-red-500 rounded-full text-muted-foreground"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleSaveEdit(index)}
                      className="p-1.5 bg-primary/10 text-primary rounded-full"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <Input 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveEdit(index)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                  className="h-7 text-xs font-bold uppercase tracking-wider mb-2 p-1 border-primary"
                  autoFocus
                />
              ) : (
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 truncate">{cat}</p>
              )}
              
              <p className="text-xl font-extrabold text-foreground">
                {formatCurrency(categoryTotals[cat] || 0, symbol, state.currency)}
              </p>
            </Card>
          );
        })}
        
        <Card 
          onClick={onAddCategory}
          className="flat-card p-6 border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all min-h-[140px]"
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Add Category</p>
        </Card>
      </div>
    </div>
  );
}
