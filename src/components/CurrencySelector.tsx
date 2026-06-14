"use client";

import { CURRENCIES } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[100px] h-12 bg-white border border-border rounded-full shadow-lg font-bold text-sm">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <SelectValue placeholder="USD" />
          </div>
        </SelectTrigger>
        <SelectContent align="end" className="rounded-2xl border-border shadow-xl">
          {CURRENCIES.map((c) => (
            <SelectItem key={c.code} value={c.code} className="py-2.5 font-semibold">
              {c.symbol} {c.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}