import { Preferences } from "@capacitor/preferences";
import { INITIAL_STATE } from "@/lib/default-state";

const STORAGE_KEY = "teen_track_state";
const LOCK_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

// Browser-safe UUID helper
function generateUUID() {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Deep clone a state object
function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

// Clean and normalize state object
function normalizeState(value) {
  const base = cloneState(INITIAL_STATE);
  return {
    ...base,
    ...value,
    transactions: Array.isArray(value?.transactions) ? value.transactions : [],
    categories: Array.isArray(value?.categories) && value.categories.length > 0 ? value.categories : base.categories,
    unlockedAchievements: Array.isArray(value?.unlockedAchievements) ? value.unlockedAchievements : [],
    lockedUntil: typeof value?.lockedUntil === "number" ? value.lockedUntil : null,
  };
}

// Load state from Capacitor Preferences (falls back to browser localStorage automatically)
export async function loadLocalState() {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    if (value) {
      return normalizeState(JSON.parse(value));
    }
  } catch (e) {
    console.error("Failed to load local state, falling back to initial state:", e);
  }
  return cloneState(INITIAL_STATE);
}

// Save state to Capacitor Preferences
export async function saveLocalState(state) {
  try {
    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(state),
    });
  } catch (e) {
    console.error("Failed to save local state:", e);
  }
}

// Helper to create a transaction
function createLocalTransaction(input) {
  return {
    id: generateUUID(),
    amount: input.amount,
    type: input.type,
    category: input.category,
    description: input.description,
    date: input.date,
    timestamp: Date.now(),
  };
}

// Update consecutive logging active streak count
function updateLocalActiveStreak(state) {
  const todayStr = new Date().toISOString().split("T")[0];
  if (!state.lastActiveDate) {
    state.streakCount = 1;
    state.lastActiveDate = todayStr;
    return;
  }

  if (state.lastActiveDate === todayStr) {
    return;
  }

  const lastActive = new Date(state.lastActiveDate);
  const today = new Date(todayStr);
  const diffTime = Math.abs(today - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    state.streakCount += 1;
  } else {
    state.streakCount = 1;
  }
  state.lastActiveDate = todayStr;
}

// Recalculate unlocked achievements
function updateLocalAchievements(state) {
  const achievements = new Set(state.unlockedAchievements);
  const incomeCount = state.transactions.filter((t) => t.type === "income").length;
  const expenseCount = state.transactions.filter((t) => t.type === "expense").length;

  if (state.transactions.length > 0) achievements.add("first_tx");
  if (expenseCount >= 5) achievements.add("five_exp");
  if (incomeCount >= 3) achievements.add("three_inc");
  if (state.flexibleSavings >= 100) achievements.add("flex_saver");
  if (state.lockedSavings >= 100) achievements.add("locked_champ");
  if (state.totalBalance >= 1000) achievements.add("balance_keeper");

  // Consistency & Streaks
  if (state.streakCount >= 7) achievements.add("streak_7");
  if (state.streakCount >= 30) achievements.add("streak_30");

  // Smart Spending Choices: No-Spend Day
  const datesWithIncome = new Set(state.transactions.filter(t => t.type === 'income').map(t => t.date));
  const datesWithExpense = new Set(state.transactions.filter(t => t.type === 'expense').map(t => t.date));
  const hasNoSpendDay = Array.from(datesWithIncome).some(date => !datesWithExpense.has(date));
  if (hasNoSpendDay) achievements.add("no_spend");

  // Goal Getter
  if (state.flexibleSavings >= state.flexibleGoal || state.lockedSavings >= state.lockedGoal) {
    achievements.add("goal_getter");
  }

  // First Paycheck
  const hasPayday = state.transactions.some(t => t.category === 'Aureon Technologies' && t.type === 'income');
  if (hasPayday) achievements.add("payday");

  // Level Up
  const totalSaved = state.flexibleSavings + state.lockedSavings;
  const isSpendLevelUp = expenseCount > 3;
  const isSaveLevelUp = totalSaved > 100;
  if (isSpendLevelUp || isSaveLevelUp) {
    achievements.add("level_up");
  }

  state.unlockedAchievements = Array.from(achievements);
}

// 1. Add a transaction (income or expense)
export async function addLocalTransaction(state, input) {
  const nextState = cloneState(state);
  
  if (input.type === "expense" && nextState.totalBalance < input.amount) {
    throw new Error("Insufficient funds");
  }

  const transaction = createLocalTransaction(input);
  nextState.transactions.push(transaction);
  nextState.totalBalance += input.type === "income" ? input.amount : -input.amount;

  updateLocalActiveStreak(nextState);
  updateLocalAchievements(nextState);
  await saveLocalState(nextState);
  return nextState;
}

// 2. Deposit, withdraw, lock, or adjust savings stashes
export async function updateLocalSavings(state, input) {
  const nextState = cloneState(state);
  
  if (input.action !== "adjust" && input.amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const date = new Date().toISOString().split("T")[0];
  const isFlexible = input.type === "flex";
  const balanceKey = isFlexible ? "flexibleSavings" : "lockedSavings";
  const categoryLabel = isFlexible ? "Flexible Stash" : "The Vault";

  if (input.action === "deposit" || input.action === "lock") {
    if (nextState.totalBalance < input.amount) {
      throw new Error("Insufficient funds");
    }
    nextState.totalBalance -= input.amount;
    nextState[balanceKey] += input.amount;

    if (!isFlexible) {
      nextState.lockedUntil = Date.now() + LOCK_DURATION_MS;
    }

    nextState.transactions.push(
      createLocalTransaction({
        amount: input.amount,
        type: "income",
        category: "Other",
        description: `Saved to ${categoryLabel}`,
        date,
      })
    );
  }

  if (input.action === "withdraw") {
    if (nextState[balanceKey] < input.amount) {
      throw new Error(`Not enough in ${categoryLabel}`);
    }

    nextState[balanceKey] -= input.amount;
    nextState.totalBalance += input.amount;
    nextState.transactions.push(
      createLocalTransaction({
        amount: input.amount,
        type: "expense",
        category: "Other",
        description: `Withdrew from ${categoryLabel}`,
        date,
      })
    );
  }

  if (input.action === "adjust") {
    nextState[balanceKey] = input.amount;
  }

  updateLocalActiveStreak(nextState);
  updateLocalAchievements(nextState);
  await saveLocalState(nextState);
  return nextState;
}

// 3. Update savings goals targets
export async function updateLocalGoals(state, input) {
  const nextState = cloneState(state);
  nextState.flexibleGoal = input.flexibleGoal;
  nextState.lockedGoal = input.lockedGoal;
  
  await saveLocalState(nextState);
  return nextState;
}

// 4. Add a custom category card
export async function addLocalCategory(state) {
  const nextState = cloneState(state);
  nextState.categories.push("New Category");
  
  await saveLocalState(nextState);
  return nextState;
}

// 5. Rename a category card
export async function updateLocalCategory(state, index, input) {
  const nextState = cloneState(state);
  
  if (index < 0 || index >= nextState.categories.length) {
    throw new Error("Category not found");
  }

  nextState.categories[index] = input.name.trim();
  
  await saveLocalState(nextState);
  return nextState;
}

// 6. Delete a category card
export async function deleteLocalCategory(state, index) {
  const nextState = cloneState(state);
  
  if (index < 0 || index >= nextState.categories.length) {
    throw new Error("Category not found");
  }
  if (nextState.categories.length === 1) {
    throw new Error("At least one category is required");
  }

  nextState.categories.splice(index, 1);
  
  await saveLocalState(nextState);
  return nextState;
}

// 7. Update display currency code
export async function updateLocalCurrency(state, input) {
  const nextState = cloneState(state);
  nextState.currency = input.currency.trim();
  
  await saveLocalState(nextState);
  return nextState;
}

// 8. Claim vault bonus + unlock vault
export async function unlockLocalVault(state) {
  const nextState = cloneState(state);
  
  if (!nextState.lockedUntil || nextState.lockedUntil > Date.now()) {
    throw new Error("Vault is not ready to unlock");
  }

  const bonus = nextState.lockedSavings * 0.05;
  nextState.totalBalance += nextState.lockedSavings + bonus;
  nextState.lockedSavings = 0;
  nextState.lockedUntil = null;
  
  nextState.transactions.push(
    createLocalTransaction({
      amount: bonus,
      type: "income",
      category: "Other",
      description: "Vault Bonus (5%)",
      date: new Date().toISOString().split("T")[0],
    })
  );

  updateLocalActiveStreak(nextState);
  updateLocalAchievements(nextState);
  await saveLocalState(nextState);
  return nextState;
}
