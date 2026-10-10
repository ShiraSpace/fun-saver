import { GOAL_COPY } from '@/components/Goal/constants';
import { MONEY_COPY } from '@/components/Money/constants';

export const LOCKED_SAVINGS_TEST_IDS = {
  panel: 'locked-savings',
  heading: 'locked-savings-heading',
  stillToSave: 'locked-savings-still-to-save',
} as const;

export const LOCKED_SAVINGS_COPY = {
  heading: (goalName: string): string =>
    `${GOAL_COPY.lock} החיסכון שמור ליעד „${goalName}”`,
  stillToSave: (stillToSaveShekels: number): string =>
    `עוד ${MONEY_COPY.currencySign}${stillToSaveShekels} ומגיעים ליעד!`,
} as const;
