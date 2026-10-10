import { MONEY_COPY } from '@/components/Money/constants';

export const VIEW_GOAL_TEST_IDS = {
  container: 'view-goal',
  reachedHeading: 'view-goal-reached-heading',
  badge: 'view-goal-badge',
  back: 'view-goal-back',
} as const;

export const VIEW_GOAL_COPY = {
  titleIcon: '🎯',
  title: (accountName: string): string => `היעד של ${accountName}`,
  reachedHeading: '🎉 הגעת ליעד! 🎉',
  lockedBadge: '🔒 שומרים עד היעד',
  openBadge: 'קופת החיסכון פתוחה למשיכה',
  back: 'חזרה',
} as const;

export const GOAL_HERO_TEST_IDS = {
  hero: 'goal-hero',
  picture: 'goal-hero-picture',
  name: 'goal-hero-name',
  saved: 'goal-hero-saved',
  amount: 'goal-hero-amount',
  stillToSave: 'goal-hero-still-to-save',
} as const;

export const GOAL_HERO_COPY = {
  savedSuffix: 'נחסכו',
  amountPrefix: 'מתוך',
  stillToSave: (stillToSaveShekels: number): string =>
    `עוד ${MONEY_COPY.currencySign}${stillToSaveShekels} ומגיעים! 💪`,
  canBuy: (goalName: string, emoji: string): string =>
    `כל הכבוד! אפשר לקנות את „${goalName}” ${emoji}`,
} as const;
