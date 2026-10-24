import type { Goal, GoalRequest } from './types';
import { fetchJson } from '@/lib/fetch-json';

export interface GoalSetRequest {
  accountId: string;
  request: GoalRequest;
}

function goalsEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}/goals`;
}

export function setGoal({ accountId, request }: GoalSetRequest): Promise<Goal> {
  return fetchJson<Goal>({ url: goalsEndpoint(accountId), method: 'POST', body: request });
}
