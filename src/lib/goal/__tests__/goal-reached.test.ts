import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { goalReached } from '../goal-reached';

describe('goalReached', () => {
  it('returns false while the balance is one agora short of the goal', () => {
    expect(goalReached(mockGoal, mockGoal.amount - 1)).toBe(false);
  });

  it('returns true once the balance equals the goal', () => {
    expect(goalReached(mockGoal, mockGoal.amount)).toBe(true);
  });
});
