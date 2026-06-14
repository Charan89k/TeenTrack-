"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Wallet, PiggyBank, BarChart3 } from "lucide-react";

type Tab = 'Dashboard' | 'Expenses' | 'Savings' | 'Analytics';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TABS: { id: Tab; icon: any; label: string }[] = [
  { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'Expenses', icon: Wallet, label: 'Wallet' },
  { id: 'Savings', icon: PiggyBank, label: 'Vault' },
  { id: 'Analytics', icon: BarChart3, label: 'Stats' },
];

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <div className="sticky top-6 z-40 flex justify-center w-full">
      <nav className="flex items-center gap-1 p-1.5 bg-white border border-border rounded-full shadow-lg">
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