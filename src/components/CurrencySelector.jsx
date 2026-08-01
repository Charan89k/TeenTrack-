import { CURRENCIES } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export function CurrencySelector({ currency, value, onCurrencyChange, onChange }) {
  const activeValue = currency || value;
  const activeOnChange = onCurrencyChange || onChange;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Select value={activeValue} onValueChange={activeOnChange}>
        <SelectTrigger className="w-[100px] h-12 bg-card/90 backdrop-blur-md border border-border rounded-full shadow-lg font-bold text-sm">
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
