import { GOAL_ENDING } from '@/lib/goal/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { createMockGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { createMockWithdrawal } from '@/test-utils/mocks/transaction.mocks';
import { createMockWallet } from '@/test-utils/mocks/wallet.mocks';
import { completedGoalEndRequest, endActiveGoal } from '../goals';

describe('completedGoalEndRequest', () => {
  it('ends the goal as completed at the moment the withdrawal was made', () => {
    const mockWithdrawal = createMockWithdrawal(createMockWallet());

    expect(completedGoalEndRequest(mockWithdrawal, mockGoal.id)).toEqual({
      goalId: mockGoal.id,
      accountId: mockWithdrawal.accountId,
      endedAt: mockWithdrawal.createdAt,
      ending: GOAL_ENDING.completed,
    });
  });
});

describe('endActiveGoal', () => {
  const mockEndRequest = {
    goalId: mockGoal.id,
    accountId: mockAccount.id,
    endedAt: '2026-02-01T00:00:00.000Z',
    ending: GOAL_ENDING.cancelled,
  };

  it('stores the goal as ended and leaves the goal it was given untouched', () => {
    const mockActiveGoal = createMockGoal();
    const mockGoals = [mockActiveGoal];

    const endedGoal = endActiveGoal(mockGoals, mockEndRequest);

    expect(mockGoals).toEqual([endedGoal]);
    expect(endedGoal).toEqual({
      ...mockGoal,
      endedAt: mockEndRequest.endedAt,
      ending: mockEndRequest.ending,
    });
    expect(mockActiveGoal).toEqual(mockGoal);
  });
});
