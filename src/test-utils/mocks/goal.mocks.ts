import { GOAL_PICTURE_KIND } from '@/lib/goal/constants';
import type { Goal, GoalPicture } from '@/lib/goal/types';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { mockAccount } from './account.mocks';

export function createMockGoalPicture(emoji: string): GoalPicture {
  return { kind: GOAL_PICTURE_KIND.emoji, emoji };
}

export function createMockGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'g1',
    accountId: mockAccount.id,
    name: 'אופניים',
    amount: 30000,
    picture: createMockGoalPicture('🚲'),
    startedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export const mockGoal: Goal = createMockGoal();

export function createMockSavedTowardGoal(
  overrides: Partial<SavedTowardGoal> = {}
): SavedTowardGoal {
  return {
    goal: mockGoal,
    saved: 8500,
    stillToSave: 21500,
    reached: false,
    ...overrides,
  };
}
