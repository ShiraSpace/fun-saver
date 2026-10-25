import type { Goal, GoalRequest } from './types';
import { fetchJson } from '@/lib/fetch-json';
import { accountEndpoint } from '@/lib/account/account-requests';

export interface GoalSetRequest {
  accountId: string;
  request: GoalRequest;
}

function goalsEndpoint(accountId: string): string {
  return `${accountEndpoint(accountId)}/goals`;
}

function goalEndpoint({ accountId, id }: Goal): string {
  return `${goalsEndpoint(accountId)}/${id}`;
}

export function setGoal({ accountId, request }: GoalSetRequest): Promise<Goal> {
  return fetchJson<Goal>({ url: goalsEndpoint(accountId), method: 'POST', body: request });
}

export function cancelGoal(goal: Goal): Promise<void> {
  return fetchJson({ url: goalEndpoint(goal), method: 'DELETE' });
}
