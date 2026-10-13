import {
  isGoalAmountMissing,
  isGoalAmountTooHigh,
  isValidGoalName,
} from '@/lib/goal/goal-request-validator';

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
    nameMissing: !isValidGoalName(goalName),
    amountMissing: isGoalAmountMissing(amountShekels),
    amountTooHigh: isGoalAmountTooHigh(amountShekels),
  };
}

export function hasGoalEntryErrors(errors: GoalEntryErrors): boolean {
  return Object.values(errors).some(Boolean);
}
