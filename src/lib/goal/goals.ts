import type { DataStore } from '@/db/data-store';
import { newId } from '@/lib/ids';
import { shekelsToAgorot } from '@/lib/money';
import { GOAL_ENDING } from './constants';
import { GoalNotActiveError } from './errors';
import type { GoalInput } from './goal-input';
import type { Goal } from './types';

interface SetGoalParams {
  store: DataStore;
  accountId: string;
  input: GoalInput;
}

interface CancelGoalParams {
  store: DataStore;
  accountId: string;
  goalId: string;
}

export async function setGoal({
  store,
  accountId,
  input,
}: SetGoalParams): Promise<Goal> {
  const goal: Goal = {
    id: newId(),
    accountId,
    name: input.name,
    amount: shekelsToAgorot(input.amountShekels),
    picture: input.picture,
    startedAt: new Date().toISOString(),
  };

  await store.insertGoal(goal);

  return goal;
}

export async function cancelGoal({
  store,
  accountId,
  goalId,
}: CancelGoalParams): Promise<Goal> {
  const cancelledGoal = await store.endGoal({
    goalId,
    accountId,
    endedAt: new Date().toISOString(),
    ending: GOAL_ENDING.cancelled,
  });

  if (!cancelledGoal) {
    throw new GoalNotActiveError(goalId);
  }

  return cancelledGoal;
}
