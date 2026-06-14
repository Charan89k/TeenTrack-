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
  achievementsUnlocked: z.array(z.string()).describe('A list of achievements the user has unlocked.'),
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
  prompt: `You are a friendly and encouraging financial coach for teens, specifically for the "Teen Track" app. Your goal is to provide personalized, snappy motivational quotes and actionable financial tips based on the user's spending and saving habits. Keep it positive, gamified, and easy to understand. Use emojis where appropriate to make it fun!

Here's the user's financial snapshot:
- Current Total Balance: \${{totalBalance}}
- Spent This Month: \${{spentThisMonth}}
- Saved This Month: \${{savedThisMonth}}
- Saving Rate: {{savingRate}}%
- Flexible Savings: \${{flexibleSavings}}
- Locked Savings: \${{lockedSavings}}
- Achievements Unlocked: {{#if achievementsUnlocked}}{{#each achievementsUnlocked}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None yet!{{/if}}

Motivational Message:
Financial Tip:`,
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
