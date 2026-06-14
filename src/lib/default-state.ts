import type { AppState } from "@/lib/types";

export const INITIAL_STATE: AppState = {
  transactions: [],
  totalBalance: 0,
  flexibleSavings: 0,
  lockedSavings: 0,
  flexibleGoal: 500,
  lockedGoal: 1000,
  lockedUntil: null,
  currency: "INR",
  unlockedAchievements: [],
  categories: ["Shopping", "Gaming", "Food", "Miscellaneous"],
};
