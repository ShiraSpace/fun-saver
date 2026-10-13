import type { Goal, GoalRequest } from '@/lib/goal/types';
import { fetchJson } from '@/lib/fetch-json';
import { goalsEndpoint } from './constants';

export interface GoalSetRequest {
  accountId: string;
  request: GoalRequest;
}

interface GoalSetter {
  setGoal: (goalSetRequest: GoalSetRequest) => Promise<Goal>;
}

export function useSetGoal(): GoalSetter {
  const setGoal = ({ accountId, request }: GoalSetRequest): Promise<Goal> =>
    fetchJson<Goal>({
      url: goalsEndpoint(accountId),
      method: 'POST',
      body: request,
    });

  return { setGoal };
}
