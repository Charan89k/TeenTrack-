
'use server';
/**
 * @fileOverview A Genkit flow for generating personalized motivational messages and financial tips for teen users.
 *
 * - teenTrackAIMotivator - A function that generates AI-powered motivation and tips.
 * - TeenTrackAIMotivatorInput - The input type for the teenTrackAIMotivator function.
 * - TeenTrackAIMotivatorOutput - The return type for the teenTrackAIMotivator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TeenTrackAIMotivatorInputSchema = z.object({
  totalBalance: z.number().describe('The user\'s current total balance.'),
  spentThisMonth: z.number().describe('The total amount spent by the user this month.'),
  savedThisMonth: z.number().describe('The total amount saved by the user this month.'),
  savingRate: z.number().describe('The user\'s saving rate as a percentage.'),
  flexibleSavings: z.number().describe('The current balance in flexible savings.'),
  lockedSavings: z.number().describe('The current balance in locked savings.'),
  achievementsCount: z.number().describe('The number of achievements the user has unlocked.'),
});
export type TeenTrackAIMotivatorInput = z.infer<typeof TeenTrackAIMotivatorInputSchema>;

const TeenTrackAIMotivatorOutputSchema = z.object({
  motivation: z.string().describe('A personalized motivational message.'),
  tip: z.string().describe('A practical financial tip.'),
});
export type TeenTrackAIMotivatorOutput = z.infer<typeof TeenTrackAIMotivatorOutputSchema>;

export async function teenTrackAIMotivator(input: TeenTrackAIMotivatorInput): Promise<TeenTrackAIMotivatorOutput> {
  return teenTrackAIMotivatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'teenTrackAIMotivatorPrompt',
  input: {schema: TeenTrackAIMotivatorInputSchema},
  output: {schema: TeenTrackAIMotivatorOutputSchema},
  prompt: `You are a professional yet friendly financial coach for Gen Z users. You provide pithy, confident, and motivating financial advice.

User Financial Data:
- Total Balance: {{{totalBalance}}}
- Spent this Month: {{{spentThisMonth}}}
- Saved this Month: {{{savedThisMonth}}}
- Saving Rate: {{{savingRate}}}%
- Flexible Stash: {{{flexibleSavings}}}
- Locked Vault: {{{lockedSavings}}}
- Achievements Count: {{{achievementsCount}}}

Instructions:
1. Provide a confidence-boosting motivational quote based on their progress.
2. Provide one actionable financial tip that focuses on smart habits.
3. Be concise and use a high-energy, positive tone.
4. If they have unlocked many achievements, mention their "Boss" status.

Output JSON format with 'motivation' and 'tip' fields.`,
});

const teenTrackAIMotivatorFlow = ai.defineFlow(
  {
    name: 'teenTrackAIMotivatorFlow',
    inputSchema: TeenTrackAIMotivatorInputSchema,
    outputSchema: TeenTrackAIMotivatorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
