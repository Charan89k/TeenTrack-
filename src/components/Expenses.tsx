
"use client";

import { useState } from "react";
import { AppState, INCOME_SOURCES, CATEGORIES, CATEGORY_EMOJIS } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils-finance";
import { Loader2 } from "lucide-react";

interface ExpensesProps {
  state: AppState;
  symbol: string;
  onAddTransaction: (amount: number, type: 'income' | 'expense', category: string, description: string, date: string) => void;
}

export function Expenses({ state, symbol, onAddTransaction }: ExpensesProps) {
  const [incomeForm, setIncomeForm] = useState({ amount: '', source: 'Allowance', desc: '', date: new Date().toISOString().split('T')[0] });
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: 'Shopping', desc: '', date: new Date().toISOString().split('T')[0] });
  const [isSubmitting, setIsSubmitting] = useState<'income' | 'expense' | null>(null);

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.amount) return;
    setIsSubmitting('income');
    await new Promise(r => setTimeout(r, 800));
    onAddTransaction(parseFloat(incomeForm.amount), 'income', incomeForm.source, incomeForm.desc, incomeForm.date);
    setIncomeForm({ amount: '', source: 'Allowance', desc: '', date: new Date().toISOString().split('T')[0] });
    setIsSubmitting(null);
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseForm.amount);
    if (!amount || amount > state.totalBalance) return;
    setIsSubmitting('expense');
    await new Promise(r => setTimeout(r, 800));
    onAddTransaction(amount, 'expense', expenseForm.category, expenseForm.desc, expenseForm.date);
    setExpenseForm({ amount: '', category: 'Shopping', desc: '', date: new Date().toISOString().split('T')[0] });
    setIsSubmitting(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">💵 Add Money</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIncomeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input 
                  type="number" step="0.01" value={incomeForm.amount} 
                  onChange={e => setIncomeForm({...incomeForm, amount: e.target.value})} 
                  className="bg-white/10 border-white/20" placeholder="0.00" required 
                />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={incomeForm.source} onValueChange={v => setIncomeForm({...incomeForm, source: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 text-white border-white/20">
                    {INCOME_SOURCES.map(s => <SelectItem key={s} value={s}>{CATEGORY_EMOJIS[s]} {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={incomeForm.desc} onChange={e => setIncomeForm({...incomeForm, desc: e.target.value})} className="bg-white/10 border-white/20" placeholder="e.g. Birthday gift" />
              </div>
              <Button type="submit" disabled={isSubmitting === 'income'} className="w-full bg-teal-500 hover:bg-teal-600 rounded-full py-6">
                {isSubmitting === 'income' ? <Loader2 className="animate-spin" /> : 'Deposit Funds 🎉'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">➕ Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input 
                  type="number" step="0.01" value={expenseForm.amount} 
                  onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} 
                  className="bg-white/10 border-white/20" placeholder="0.00" required 
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={expenseForm.category} onValueChange={v => setExpenseForm({...expenseForm, category: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 text-white border-white/20">
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={expenseForm.desc} onChange={e => setExpenseForm({...expenseForm, desc: e.target.value})} className="bg-white/10 border-white/20" placeholder="e.g. Pizza with friends" />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting === 'expense' || (parseFloat(expenseForm.amount) > state.totalBalance)} 
                className="w-full bg-coral-500 hover:bg-coral-600 rounded-full py-6"
              >
                {isSubmitting === 'expense' ? <Loader2 className="animate-spin" /> : 'Log Expense 💸'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">📋 Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.transactions.length === 0 ? (
              <p className="text-center text-white/50 py-10">No transactions yet. Start tracking your money! 🚀</p>
            ) : (
              state.transactions.slice(-10).reverse().map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 glass-card bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{CATEGORY_EMOJIS[t.category]}</span>
                    <div>
                      <p className="font-bold">{t.category}</p>
                      <p className="text-sm text-white/60">{t.description || 'No description'}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-tighter">{t.date}</p>
                    </div>
                  </div>
                  <p className={cn("text-xl font-bold", t.type === 'income' ? 'text-teal-400' : 'text-coral-400')}>
                    {t.type === 'income' ? '+' : '−'} {formatCurrency(t.amount, symbol)}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
