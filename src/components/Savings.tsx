
"use client";

import { useState, useEffect } from "react";
import { AppState } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils-finance";

interface SavingsProps {
  state: AppState;
  symbol: string;
  onUpdateSavings: (type: 'flex' | 'locked', amount: number, action: 'deposit' | 'withdraw' | 'lock') => void;
  onUnlock: () => void;
}

export function Savings({ state, symbol, onUpdateSavings, onUnlock }: SavingsProps) {
  const [flexAmount, setFlexAmount] = useState('');
  const [lockedAmount, setLockedAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!state.lockedUntil) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = state.lockedUntil! - now;
      if (diff <= 0) {
        setTimeLeft('ready');
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeLeft(`${days}d ${hours}h`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.lockedUntil]);

  const totalSaved = state.flexibleSavings + state.lockedSavings;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card rainbow-shimmer">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>🔄 Flexible Savings</span>
              <span className="text-xl font-bold">{formatCurrency(state.flexibleSavings, symbol)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60">
                <span>Progress to $500 goal</span>
                <span>{Math.min(100, Math.round((state.flexibleSavings / 500) * 100))}%</span>
              </div>
              <Progress value={(state.flexibleSavings / 500) * 100} className="h-3 bg-white/10" />
            </div>
            <p className="text-sm text-white/60 italic">Emergency stash! Withdraw anytime for snacks or games.</p>
            <div className="flex gap-2">
              <Input type="number" placeholder="0.00" value={flexAmount} onChange={e => setFlexAmount(e.target.value)} className="bg-white/10 border-white/20" />
              <Button onClick={() => onUpdateSavings('flex', parseFloat(flexAmount), 'deposit')} className="bg-teal-500 hover:bg-teal-600">Save</Button>
              <Button onClick={() => onUpdateSavings('flex', parseFloat(flexAmount), 'withdraw')} variant="outline" className="border-white/20">Take</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rainbow-shimmer">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>🔒 Locked Savings</span>
              <span className="text-xl font-bold">{formatCurrency(state.lockedSavings, symbol)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60">
                <span>Progress to $1000 goal</span>
                <span>{Math.min(100, Math.round((state.lockedSavings / 1000) * 100))}%</span>
              </div>
              <Progress value={(state.lockedSavings / 1000) * 100} className="h-3 bg-white/10" />
            </div>
            {state.lockedUntil ? (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                {timeLeft === 'ready' ? (
                  <div className="space-y-2">
                    <p className="text-teal-400 font-bold">✅ Ready to unlock with 5% bonus!</p>
                    <Button onClick={onUnlock} className="bg-teal-500 w-full">Claim Bonus & Unlock</Button>
                  </div>
                ) : (
                  <p className="text-white/60">🔒 Locked for {timeLeft || 'calculating...'}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-white/60 italic">The Vault! Lock for 30 days to earn a massive 5% bonus.</p>
                <div className="flex gap-2">
                  <Input type="number" placeholder="0.00" value={lockedAmount} onChange={e => setLockedAmount(e.target.value)} className="bg-white/10 border-white/20" />
                  <Button onClick={() => onUpdateSavings('locked', parseFloat(lockedAmount), 'lock')} className="bg-coral-500 hover:bg-coral-600 w-full">Lock & Save 🔐</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card p-6">
        <h3 className="text-xl font-bold mb-6">🎯 Savings Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>🚑 Emergency Fund</span>
              <span>{formatCurrency(totalSaved, symbol)} / {formatCurrency(2000, symbol)}</span>
            </div>
            <Progress value={(totalSaved / 2000) * 100} className="h-4 bg-white/10" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>💎 Dream Purchase</span>
              <span>{formatCurrency(totalSaved, symbol)} / {formatCurrency(1500, symbol)}</span>
            </div>
            <Progress value={(totalSaved / 1500) * 100} className="h-4 bg-white/10" />
          </div>
        </div>
      </Card>
    </div>
  );
}
