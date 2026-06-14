
"use client";

import { useState } from "react";
import { AppState, INCOME_SOURCES, CATEGORY_EMOJIS } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, getAutoEmoji } from "@/lib/utils-finance";
import { Loader2, Plus, Minus, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpensesProps {
  state: AppState;
  symbol: string;
  onAddTransaction: (amount: number, type: 'income' | 'expense', category: string, description: string, date: string) => void;
}

export function Expenses({ state, symbol, onAddTransaction }: ExpensesProps) {
  const [incomeForm, setIncomeForm] = useState({ amount: '', source: 'Allowance', desc: '', date: new Date().toISOString().split('T')[0] });
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: state.categories[0], desc: '', date: new Date().toISOString().split('T')[0] });
  const [isSubmitting, setIsSubmitting] = useState<'income' | 'expense' | null>(null);

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.amount) return;
    setIsSubmitting('income');
    await new Promise(r => setTimeout(r, 600));
    onAddTransaction(parseFloat(incomeForm.amount), 'income', incomeForm.source, incomeForm.desc, incomeForm.date);
    setIncomeForm({ amount: '', source: 'Allowance', desc: '', date: new Date().toISOString().split('T')[0] });
    setIsSubmitting(null);
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseForm.amount);
    if (!amount || amount > state.totalBalance) return;
    setIsSubmitting('expense');
    await new Promise(r => setTimeout(r, 600));
    onAddTransaction(amount, 'expense', expenseForm.category, expenseForm.desc, expenseForm.date);
    setExpenseForm({ amount: '', category: state.categories[0], desc: '', date: new Date().toISOString().split('T')[0] });
    setIsSubmitting(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flat-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500" /> Track Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIncomeSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Amount</Label>
                  <Input 
                    type="number" step="0.01" value={incomeForm.amount} 
                    onChange={e => setIncomeForm({...incomeForm, amount: e.target.value})} 
                    className="bg-muted/50 border-none rounded-xl" placeholder="0.00" required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Source</Label>
                  <Select value={incomeForm.source} onValueChange={v => setIncomeForm({...incomeForm, source: v})}>
                    <SelectTrigger className="bg-muted/50 border-none rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_SOURCES.map(s => <SelectItem key={s} value={s}>{CATEGORY_EMOJIS[s]} {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Description</Label>
                <Input value={incomeForm.desc} onChange={e => setIncomeForm({...incomeForm, desc: e.target.value})} className="bg-muted/50 border-none rounded-xl" placeholder="What's this for?" />
              </div>
              <Button type="submit" disabled={isSubmitting === 'income'} className="w-full pill-button bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20">
                {isSubmitting === 'income' ? <Loader2 className="animate-spin" /> : 'Log Income'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="flat-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Minus className="w-5 h-5 text-red-500" /> Track Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Amount</Label>
                  <Input 
                    type="number" step="0.01" value={expenseForm.amount} 
                    onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} 
                    className="bg-muted/50 border-none rounded-xl" placeholder="0.00" required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Category</Label>
                  <Select value={expenseForm.category} onValueChange={v => setExpenseForm({...expenseForm, category: v})}>
                    <SelectTrigger className="bg-muted/50 border-none rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {state.categories.map(c => <SelectItem key={c} value={c}>{getAutoEmoji(c)} {c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Description</Label>
                <Input value={expenseForm.desc} onChange={e => setExpenseForm({...expenseForm, desc: e.target.value})} className="bg-muted/50 border-none rounded-xl" placeholder="Where'd it go?" />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting === 'expense' || (parseFloat(expenseForm.amount) > state.totalBalance)} 
                className="w-full pill-button bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              >
                {isSubmitting === 'expense' ? <Loader2 className="animate-spin" /> : 'Log Expense'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="flat-card overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-md font-bold flex items-center gap-2 uppercase tracking-widest">
            <History className="w-4 h-4" /> Activity Feed
          </CardTitle>
        </CardHeader>
        <div className="divide-y divide-border">
          {state.transactions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground font-medium">No activity yet. Start tracking to see your feed.</p>
            </div>
          ) : (
            state.transactions.slice(-8).reverse().map(t => (
              <div key={t.id} className="flex items-center justify-between p-6 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl">
                    {CATEGORY_EMOJIS[t.category] || getAutoEmoji(t.category)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t.category}</p>
                    <p className="text-sm text-muted-foreground font-medium">{t.description || 'General entry'}</p>
                    <p className="text-[10px] text-muted-foreground/50 font-bold uppercase mt-1">{t.date}</p>
                  </div>
                </div>
                <p className={cn("text-xl font-extrabold", t.type === 'income' ? 'text-green-600' : 'text-foreground')}>
                  {t.type === 'income' ? '+' : '−'} {formatCurrency(t.amount, symbol, state.currency)}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
