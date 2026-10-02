import { Badge } from "@/components/ui/badge";
import { Banknote, Sun, Moon } from "lucide-react";

export function Header({ spendLevel, saveLevel, theme, onToggleTheme }) {
  return (
    <header className="py-6 sm:py-8 flex flex-wrap gap-y-4 justify-between items-center animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="TeenTrack Logo" className="w-14 h-14 sm:w-20 sm:h-20 object-contain" />
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          TeenTrack
        </h1>
      </div>
      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 sm:gap-6">
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 active:scale-95 shadow-sm"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Spend Rank</span>
          <Badge variant="secondary" className="px-3 py-1 rounded-full text-[10px] font-black bg-card border-border shadow-sm text-primary uppercase">
            {spendLevel}
          </Badge>
        </div>
        <div className="flex flex-col items-end border-l pl-4 sm:pl-6 border-border">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Save Rank</span>
          <Badge variant="secondary" className="px-3 py-1 rounded-full text-[10px] font-black bg-card border-border shadow-sm text-primary uppercase">
            {saveLevel}
          </Badge>
        </div>
      </div>
    </header>
  );
}
