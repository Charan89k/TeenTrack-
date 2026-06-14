"use client";

import { useState, useEffect } from "react";
import { AppState } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils-finance";
import { ShieldCheck, Zap, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavingsProps {
  state: AppState;
  symbol: string;
  onUpdateSavings: (type: 'flex' | 'locked', amount: number, action: 'deposit' | 'withdraw' | 'lock' | 'adjust') => void;
  onUpdateGoals: (flex: number, locked: number) => void;
  onUnlock: () => void;
}

export function Savings({ state, symbol, onUpdateSavings, onUpdateGoals, onUnlock }: SavingsProps) {
  const [flexAmount, setFlexAmount] = useState('');
  const [lockedAmount, setLockedAmount] = useState('');
  const [flexGoalInput, setFlexGoalInput] = useState(state.flexibleGoal.toString());
  const [lockedGoalInput, setLockedGoalInput] = useState(state.lockedGoal.toString());
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isAdjustingBalance, setIsAdjustingBalance] = useState(false);
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-extrabold tracking-tight">Your Stashes</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAdjustingBalance(!isAdjustingBalance)}
            className={cn("pill-button px-4 h-9", isAdjustingBalance && "bg-primary/10 text-primary")}
          >
            Adjust Balance
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className={cn("pill-button px-4 h-9", isEditingGoals && "bg-primary/10 text-primary")}
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Edit Goals
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Flexible Stash */}
        <Card className="flat-card">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Flexible Stash</span>
              <span className="text-2xl font-black">{formatCurrency(state.flexibleSavings, symbol, state.currency)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Goal: {formatCurrency(state.flexibleGoal, symbol, state.currency)}</span>
                <span>{Math.min(100, Math.round((state.flexibleSavings / state.flexibleGoal) * 100))}%</span>
              </div>
              <Progress value={(state.flexibleSavings / state.flexibleGoal) * 100} className="h-2 bg-muted" />
            </div>

            {isEditingGoals ? (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Set Target Amount</label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    value={flexGoalInput} 
                    onChange={e => setFlexGoalInput(e.target.value)} 
                    className="bg-muted border-none rounded-xl"
                  />
                  <Button onClick={() => onUpdateGoals(parseFloat(flexGoalInput), state.lockedGoal)} className="bg-primary text-white pill-button">Set</Button>
                </div>
              </div>
            ) : isAdjustingBalance ? (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Manual Adjustment (Overwrite)</label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Set final balance" 
                    value={flexAmount} 
                    onChange={e => setFlexAmount(e.target.value)} 
                    className="bg-muted border-none rounded-xl"
                  />
                  <Button onClick={() => onUpdateSavings('flex', parseFloat(flexAmount), 'adjust')} className="bg-foreground text-white pill-button">Adjust</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input type="number" placeholder="0.00" value={flexAmount} onChange={e => setFlexAmount(e.target.value)} className="bg-muted border-none rounded-xl" />
                  <Button onClick={() => onUpdateSavings('flex', parseFloat(flexAmount), 'deposit')} className="bg-foreground text-white pill-button px-6">Save</Button>
                  <Button onClick={() => onUpdateSavings('flex', parseFloat(flexAmount), 'withdraw')} variant="outline" className="pill-button px-6">Withdraw</Button>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Money for movies, games, or hanging out. Access it instantly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* The Vault */}
        <Card className="flat-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> The Vault</span>
              <span className="text-2xl font-black">{formatCurrency(state.lockedSavings, symbol, state.currency)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Goal: {formatCurrency(state.lockedGoal, symbol, state.currency)}</span>
                <span>{Math.min(100, Math.round((state.lockedSavings / state.lockedGoal) * 100))}%</span>
              </div>
              <Progress value={(state.lockedSavings / state.lockedGoal) * 100} className="h-2 bg-muted" />
            </div>

            {isEditingGoals ? (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Set Target Amount</label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    value={lockedGoalInput} 
                    onChange={e => setLockedGoalInput(e.target.value)} 
                    className="bg-muted border-none rounded-xl"
                  />
                  <Button onClick={() => onUpdateGoals(state.flexibleGoal, parseFloat(lockedGoalInput))} className="bg-primary text-white pill-button">Set</Button>
                </div>
              </div>
            ) : isAdjustingBalance ? (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Manual Adjustment (Overwrite)</label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Set final balance" 
                    value={lockedAmount} 
                    onChange={e => setLockedAmount(e.target.value)} 
                    className="bg-muted border-none rounded-xl"
                  />
                  <Button onClick={() => onUpdateSavings('locked', parseFloat(lockedAmount), 'adjust')} className="bg-foreground text-white pill-button">Adjust</Button>
                </div>
              </div>
            ) : state.lockedUntil ? (
              <div className="p-6 rounded-2xl bg-primary/5 text-center">
                {timeLeft === 'ready' ? (
                  <div className="space-y-3">
                    <p className="text-primary font-bold">Bonus Ready! +5% Added</p>
                    <Button onClick={onUnlock} className="bg-primary text-white w-full pill-button py-6">Claim & Unlock</Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground font-bold flex items-center justify-center gap-2">
                    Locked for {timeLeft || '...'}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input type="number" placeholder="0.00" value={lockedAmount} onChange={e => setLockedAmount(e.target.value)} className="bg-muted border-none rounded-xl" />
                  <Button onClick={() => onUpdateSavings('locked', parseFloat(lockedAmount), 'lock')} className="bg-primary text-white w-full pill-button py-6 shadow-lg shadow-primary/20">Lock & Earn 5%</Button>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Lock money for 30 days to build discipline and earn a premium bonus.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="flat-card p-8">
        <h3 className="text-xl font-extrabold mb-8 tracking-tight">Active Savings Goals</h3>
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="font-bold text-foreground">Future Fund</p>
                <p className="text-xs text-muted-foreground font-medium">Big dreams start small.</p>
              </div>
              <span className="text-sm font-bold">{formatCurrency(totalSaved, symbol, state.currency)} / {formatCurrency(2000, symbol, state.currency)}</span>
            </div>
            <Progress value={(totalSaved / 2000) * 100} className="h-4 bg-muted" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="font-bold text-foreground">Gadget Goal</p>
                <p className="text-xs text-muted-foreground font-medium">Almost there!</p>
              </div>
              <span className="text-sm font-bold">{formatCurrency(totalSaved, symbol, state.currency)} / {formatCurrency(1500, symbol, state.currency)}</span>
            </div>
            <Progress value={(totalSaved / 1500) * 100} className="h-4 bg-muted" />
          </div>
        </div>
      </Card>
    </div>
  );
}
