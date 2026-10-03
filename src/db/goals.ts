import { GOAL_ENDING } from '@/lib/goal/constants';
import type { Goal, GoalEndRequest } from '@/lib/goal/types';
import type { Transaction } from '@/lib/transaction/types';

export function findActiveGoal(
  goals: Goal[],
  accountId: string
): Goal | undefined {
  return goals.find(
    (goal) => goal.accountId === accountId && goal.endedAt === undefined
  );
}

export function endActiveGoal(
  goals: Goal[],
  { goalId, accountId, endedAt, ending }: GoalEndRequest
): Goal | undefined {
  const goal = findActiveGoal(goals, accountId);

  if (goal?.id !== goalId) {
    return;
  }

  goal.endedAt = endedAt;
  goal.ending = ending;

  return goal;
}

export function goalCompletedBy(
  withdrawal: Transaction,
  goalId: string
): GoalEndRequest {
  return {
    goalId,
    accountId: withdrawal.accountId,
    endedAt: withdrawal.createdAt,
    ending: GOAL_ENDING.completed,
  };
}
