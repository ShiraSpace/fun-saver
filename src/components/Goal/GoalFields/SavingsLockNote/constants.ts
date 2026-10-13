import { GOAL_COPY } from '../../constants';

export const SAVINGS_LOCK_NOTE_TEST_IDS = {
  note: 'savings-lock-note',
} as const;

export const SAVINGS_LOCK_NOTE_COPY = {
  lockIcon: GOAL_COPY.lock,
  reachedIcon: '🎉',
  locked: (amountShekels: number): string =>
    `מרגע שקובעים יעד, שומרים את קופת החיסכון עד שיש בה ₪${amountShekels || '…'}.`,
  reached: (goalName: string): string =>
    `כבר יש מספיק בחיסכון! אפשר לקנות את ${goalName} כבר עכשיו.`,
} as const;
