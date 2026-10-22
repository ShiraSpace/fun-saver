import type { CountUpTiming } from '@/hooks/use-count-up';

export const CHILD_SAVINGS_TEST_IDS = {
  card: 'child-savings',
} as const;

export const CHILD_SAVINGS_COPY = {
  title: 'החיסכון שלך',
} as const;

export const SAVINGS_ROLL_UP: CountUpTiming = {
  startDelayMs: 0,
  countMs: 900,
};
