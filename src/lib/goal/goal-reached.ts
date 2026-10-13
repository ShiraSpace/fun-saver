import type { Goal } from './types';

export function goalReached(goal: Pick<Goal, 'amount'>, balance: number): boolean {
  return balance >= goal.amount;
}
