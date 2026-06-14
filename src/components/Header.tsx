
"use client";

import { Badge } from "@/components/ui/badge";

export function Header({ level }: { level: string }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-none rounded-none backdrop-blur-xl bg-white/10 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl floating-emoji">💰</span>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-coral-400 bg-clip-text text-transparent animate-pulse font-headline">
          Teen Track
        </h1>
      </div>
      <Badge className="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-orange-400 to-red-500 border-none shadow-lg animate-bounce-custom">
        {level}
      </Badge>
    </header>
  );
}
