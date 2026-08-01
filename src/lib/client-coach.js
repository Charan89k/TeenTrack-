// Client-Side Gen-Z Financial Coach Generator
// Replaces Genkit Server Actions for 100% offline local-only execution

const MOTIVATIONS = {
  highSavings: [
    "You are stacking cash like an absolute boss! 📈",
    "A saving rate of {savingRate}%? You are teaching the coach standard habits now! 👑",
    "Disciplined, growing, and track star energy. Keep that streak alive! ⚡",
    "Stacking goals! You are securing your future self, one transaction at a time."
  ],
  highVault: [
    "Your lock-in Vault discipline is top-tier! 🔒",
    "That Vault is looking heavy. Wealth Boss status is loading... 💰",
    "Future you is going to be incredibly grateful for the discipline you are building today.",
    "Vault locked, focus set. You are building financial resilience!"
  ],
  highAchievements: [
    "Look at those milestones. You're a Certified TeenTrack Legend! 👑",
    "Milestone hunter! You are absolutely dominating the tracker badges.",
    "Financial Sage badge incoming. Tracking and stashing like a professional."
  ],
  lowBalance: [
    "Every massive stash starts with a single coin. Hang in there! 🎯",
    "Budget apprentice today, stash legend tomorrow. Keep logging! 💸",
    "It is not about how much you have right now—it is about building the habit of tracking.",
    "Logging expenses when balance is tight is the real test of discipline. You got this."
  ],
  general: [
    "Consistent tracking is the ultimate budgeting superpower. Keep it up! ⚡",
    "Your TeenTrack stats are looking solid. Keep building that momentum!",
    "Balance checked. Stash growing. Let's make today a win! 💰",
    "Tracking is the key to financial freedom. Stay aware, stay smart!"
  ]
};

const TIPS = {
  highSavings: [
    "Since your saving rate is high, consider moving some flexible cash to your locked Vault to earn that extra 5% bonus.",
    "Keep a buffer in your Flexible Stash for sudden outings, and lock the rest to prevent impulsive shopping.",
    "Review your savings goals and see if you can raise your targets. You're crushing it!"
  ],
  highVault: [
    "Your Vault locks money for 30 days. Plan your expenses around this so you don't need to withdraw early.",
    "The 5% Vault bonus is literally free money. Take advantage of it to speed up your targets.",
    "Keep tracking! Every dollar put in the vault gets you closer to your gadget goals."
  ],
  highAchievements: [
    "Try setting up specific custom categories like 'Bullet 350' or 'Access' to track progress on actual purchases.",
    "Help a friend set up their budget. The best way to master personal finance is to teach it!",
    "Unlock the remaining milestones by reaching the savings and balance targets."
  ],
  lowBalance: [
    "Try logging chores, pocket money, or small part-time jobs as income to boost your total balance.",
    "Scroll through your recent activity feed. Spot one 'wants' expense you can skip next week.",
    "Aim to keep your flexible savings untouched for at least 7 days to build holding power."
  ],
  general: [
    "Pay yourself first! Move 15% of any allowance straight to your Flexible Stash before you spend a single coin.",
    "Be honest with your categories. Logging miscellaneous items correctly is key to clear analysis.",
    "Review your daily average spend on the Stats tab weekly. Try to lower it by 5% next week."
  ]
};

export async function getClientMotivation(input) {
  // Simulate network latency for a premium native feel
  await new Promise((resolve) => setTimeout(resolve, 400));

  let category = "general";
  
  if (input.totalBalance < 50) {
    category = "lowBalance";
  } else if (input.lockedSavings > 300) {
    category = "highVault";
  } else if (input.savingRate > 45) {
    category = "highSavings";
  } else if (input.achievementsCount >= 4) {
    category = "highAchievements";
  }

  const quotesList = MOTIVATIONS[category];
  const tipsList = TIPS[category];

  const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
  const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];

  // Inject dynamic variables into the strings
  const motivation = randomQuote
    .replace("{savingRate}", input.savingRate)
    .replace("{totalBalance}", input.totalBalance);
  
  const tip = randomTip
    .replace("{savingRate}", input.savingRate)
    .replace("{totalBalance}", input.totalBalance);

  return {
    motivation,
    tip
  };
}
