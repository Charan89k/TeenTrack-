
"use client";

import { Badge } from "@/components/ui/badge";
import { Banknote } from "lucide-react";

interface HeaderProps {
  spendLevel: string;
  saveLevel: string;
}

export function Header({ spendLevel, saveLevel }: HeaderProps) {
  return (
    <header className="py-8 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shadow-primary/20">
          <Banknote className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          TeenTrack
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Spend Rank</span>
          <Badge variant="secondary" className="px-3 py-1 rounded-full text-[10px] font-black bg-white border-border shadow-sm text-primary uppercase">
            {spendLevel}
          </Badge>
        </div>
        <div className="flex flex-col items-end border-l pl-6 border-border">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Save Rank</span>
          <Badge variant="secondary" className="px-3 py-1 rounded-full text-[10px] font-black bg-white border-border shadow-sm text-primary uppercase">
            {saveLevel}
          </Badge>
        </div>
      </div>
    </header>
  );
}
