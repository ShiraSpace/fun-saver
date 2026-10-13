import { MAX_GOAL_SHEKELS } from '@/lib/goal/constants';

export const GOAL_AMOUNT_FIELD_TEST_IDS = {
  input: 'goal-amount-input',
  error: 'goal-amount-error',
} as const;

export const GOAL_AMOUNT_FIELD_COPY = {
  label: 'כמה צריך? ₪',
  missing: 'צריך לכתוב כמה צריך',
  tooHigh: `אפשר עד ₪${MAX_GOAL_SHEKELS.toLocaleString('he-IL')}`,
} as const;

export const GOAL_AMOUNT_ENTRY = {
  maxDigits: String(MAX_GOAL_SHEKELS).length,
} as const;
