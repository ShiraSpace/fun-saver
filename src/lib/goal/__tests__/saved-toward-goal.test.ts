import type { AccountSummary } from '@/lib/account/types';
import { createMockAccount } from '@/test-utils/mocks/account.mocks';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { savedTowardGoalOf } from '../saved-toward-goal';

const mockGoalAmount = 30000;

function createMockAccountSaving(savingsBalance: number): AccountSummary {
  return {
    ...createMockAccount(),
    wallets: [createMockWalletSummary({ balance: savingsBalance })],
    goal: createMockGoal({ amount: mockGoalAmount }),
  };
}

describe('savedTowardGoalOf', () => {
  it('has nothing saved toward a goal when the account has none', () => {
    const mockAccountWithoutGoal = {
      ...createMockAccountSaving(8500),
      goal: undefined,
    };

    expect(savedTowardGoalOf(mockAccountWithoutGoal)).toBeUndefined();
  });

  it('floors what is saved to whole shekels', () => {
    expect(savedTowardGoalOf(createMockAccountSaving(29950))?.saved).toBe(
      29900
    );
  });

  it('counts what is still to save from the floored amount', () => {
    expect(savedTowardGoalOf(createMockAccountSaving(29950))?.stillToSave).toBe(
      100
    );
  });

  it('is reached once savings hold the goal amount', () => {
    expect(
      savedTowardGoalOf(createMockAccountSaving(mockGoalAmount))?.reached
    ).toBe(true);
  });

  it('is not reached while savings are short of the goal', () => {
    expect(savedTowardGoalOf(createMockAccountSaving(29950))?.reached).toBe(
      false
    );
  });

  it('never has a negative amount still to save', () => {
    expect(savedTowardGoalOf(createMockAccountSaving(40000))?.stillToSave).toBe(
      0
    );
  });
});
