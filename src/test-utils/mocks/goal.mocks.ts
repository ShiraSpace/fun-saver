import { GOAL_PICTURE_KIND } from '@/lib/goal/constants';
import type { Goal } from '@/lib/goal/types';
import { mockAccount } from './account.mocks';

export function createMockGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'g1',
    accountId: mockAccount.id,
    name: 'אופניים',
    amount: 30000,
    picture: { kind: GOAL_PICTURE_KIND.emoji, emoji: '🚲' },
    startedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export const mockGoal: Goal = createMockGoal();
