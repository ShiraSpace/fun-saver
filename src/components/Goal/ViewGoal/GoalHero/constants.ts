import { MONEY_COPY } from '@/components/Money/constants';

export const GOAL_HERO_TEST_IDS = {
  hero: 'goal-hero',
  picture: 'goal-hero-picture',
  name: 'goal-hero-name',
  saved: 'goal-hero-saved',
  amount: 'goal-hero-amount',
  encouragement: 'goal-hero-encouragement',
} as const;

export const GOAL_HERO_COPY = {
  savedSuffix: 'נחסכו',
  amountPrefix: 'מתוך',
  stillToSave: (stillToSaveShekels: number): string =>
    `עוד ${MONEY_COPY.currencySign}${stillToSaveShekels} ומגיעים! 💪`,
  canBuy: (goalName: string, emoji: string): string =>
    `כל הכבוד! אפשר לקנות את „${goalName}” ${emoji}`,
} as const;
