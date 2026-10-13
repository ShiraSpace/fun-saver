import { MAX_GOAL_SHEKELS } from '@/lib/goal/constants';

interface GoalEntry {
  goalName: string;
  amountShekels: number;
}

export interface GoalEntryErrors {
  nameMissing: boolean;
  amountMissing: boolean;
  amountTooHigh: boolean;
}

export const NO_GOAL_ENTRY_ERRORS: GoalEntryErrors = {
  nameMissing: false,
  amountMissing: false,
  amountTooHigh: false,
};

export function goalEntryErrors({ goalName, amountShekels }: GoalEntry): GoalEntryErrors {
  return {
    nameMissing: goalName.trim() === '',
    amountMissing: amountShekels < 1,
    amountTooHigh: amountShekels > MAX_GOAL_SHEKELS,
  };
}

export function hasGoalEntryErrors(errors: GoalEntryErrors): boolean {
  return Object.values(errors).some(Boolean);
}
