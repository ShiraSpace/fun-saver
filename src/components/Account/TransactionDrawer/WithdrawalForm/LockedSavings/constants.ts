import { GOAL_COPY } from '@/components/Goal/constants';

export const LOCKED_SAVINGS_TEST_IDS = {
  panel: 'locked-savings',
  heading: 'locked-savings-heading',
  stillToSave: 'locked-savings-still-to-save',
} as const;

export const LOCKED_SAVINGS_COPY = {
  heading: (goalName: string): string =>
    `${GOAL_COPY.lock} החיסכון שמור ליעד „${goalName}”`,
} as const;
