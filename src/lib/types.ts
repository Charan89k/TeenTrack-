
export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  timestamp: number;
  type: TransactionType;
};

export type AppState = {
  transactions: Transaction[];
  totalBalance: number;
  flexibleSavings: number;
  lockedSavings: number;
  flexibleGoal: number;
  lockedGoal: number;
  lockedUntil: number | null;
  currency: string;
  unlockedAchievements: string[];
  categories: string[];
};

export const DEFAULT_CATEGORIES = ['Shopping', 'Gaming', 'Food', 'Miscellaneous'] as const;
export const INCOME_SOURCES = ['Allowance', 'Gift Money', 'Part-time Job', 'Chores', 'Other'] as const;

export const CATEGORY_EMOJIS: Record<string, string> = {
  Shopping: '🛍️',
  Gaming: '🎮',
  Food: '🍕',
  Miscellaneous: '🎯',
  Allowance: '💰',
  'Gift Money': '🎁',
  'Part-time Job': '💼',
  Chores: '🏠',
  Other: '🎯',
};

export type Currency = {
  code: string;
  symbol: string;
};

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
];
