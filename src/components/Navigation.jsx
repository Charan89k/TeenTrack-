import { cn } from "@/lib/utils";
import { LayoutDashboard, Wallet, PiggyBank, BarChart3 } from "lucide-react";

const TABS = [
  { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'Expenses', icon: Wallet, label: 'Wallet' },
  { id: 'Savings', icon: PiggyBank, label: 'Vault' },
  { id: 'Analytics', icon: BarChart3, label: 'Stats' },
];

export function Navigation({ activeTab, setActiveTab }) {
  return (
    <div className="sticky top-6 z-40 flex justify-center w-full animate-in fade-in duration-500">
      <nav className="flex items-center gap-1 p-1.5 bg-card/90 backdrop-blur-md border border-border rounded-full shadow-lg">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-200 text-sm font-semibold",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
