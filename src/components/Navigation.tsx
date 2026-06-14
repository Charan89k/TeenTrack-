
"use client";

import { cn } from "@/lib/utils";

type Tab = 'Dashboard' | 'Expenses' | 'Savings' | 'Analytics';

interface NavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'Dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'Expenses', icon: '💸', label: 'Expenses' },
  { id: 'Savings', icon: '💰', label: 'Savings' },
  { id: 'Analytics', icon: '📊', label: 'Analytics' },
];

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <div className="flex justify-center p-6">
      <nav className="flex items-center gap-2 p-2 glass-card rounded-full bg-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium whitespace-nowrap",
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white shadow-lg scale-105"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
