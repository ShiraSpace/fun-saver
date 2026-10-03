import type { Goal } from './types';

export function goalReached(goal: Goal, balance: number): boolean {
  return balance >= goal.amount;
}
