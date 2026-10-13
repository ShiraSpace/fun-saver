import type { Goal, GoalRequest } from '@/lib/goal/types';
import { fetchJson } from '@/lib/fetch-json';
import { goalsEndpoint } from './constants';

export interface GoalSetting {
  accountId: string;
  request: GoalRequest;
}

interface GoalSetter {
  setGoal: (setting: GoalSetting) => Promise<Goal>;
}

export function useSetGoal(): GoalSetter {
  const setGoal = ({ accountId, request }: GoalSetting): Promise<Goal> =>
    fetchJson<Goal>({
      url: goalsEndpoint(accountId),
      method: 'POST',
      body: request,
    });

  return { setGoal };
}
