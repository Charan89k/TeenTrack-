
"use client";

import { CURRENCIES } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[80px] glass-card rounded-full border-white/20 bg-black/20 backdrop-blur-md">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent className="glass-card bg-black/80 border-white/20 text-white">
          {CURRENCIES.map((c) => (
            <SelectItem key={c.code} value={c.code} className="hover:bg-white/10 focus:bg-white/10">
              {c.symbol} {c.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
