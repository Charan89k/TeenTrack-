"use client";

import { Badge } from "@/components/ui/badge";
import { Banknote } from "lucide-react";

export function Header({ level }: { level: string }) {
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
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Level</span>
        <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-xs font-bold bg-white border-border shadow-sm">
          {level}
        </Badge>
      </div>
    </header>
  );
}
