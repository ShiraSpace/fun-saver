import { act, renderHook, waitFor } from '@testing-library/react';
import { REQUEST_STATE } from '@/lib/request-state';
import { useWithdrawalForm } from './use-withdrawal-form';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import type { AccountSummary } from '@/lib/account/types';
import { mockRouter } from '@mocks/next/navigation';

const mockAddWithdrawal = jest.fn();
const mockOnClose = jest.fn();

jest.mock('./use-add-transaction', () => ({
  useAddTransaction: (): {
    addDeposit: jest.Mock;
    addWithdrawal: jest.Mock;
  } => ({
    addDeposit: jest.fn(),
    addWithdrawal: mockAddWithdrawal,
  }),
}));

const [savings, spending, goodDeeds] = mockWalletSummaries;

function setup(
  account: AccountSummary = mockAccountSummary
): ReturnType<typeof renderHook<ReturnType<typeof useWithdrawalForm>, void>> {
  return renderHook(() => useWithdrawalForm(account, mockOnClose));
}

describe('useWithdrawalForm', () => {
  beforeEach(() => {
    mockAddWithdrawal.mockReset().mockResolvedValue(undefined);
    mockRouter.refresh.mockClear();
    mockOnClose.mockClear();
  });

  it('starts on the default withdrawal wallet', () => {
    const { result } = setup();

    expect(result.current.selectedWalletId).toBe(spending.id);
  });

  it('starts with no amount and submit disabled', () => {
    const { result } = setup();

    expect(result.current.amountShekels).toBe(0);
    expect(result.current.canSubmit).toBe(false);
  });

  it('builds the amount from tapped digits', () => {
    const { result } = setup();

    act(() => result.current.onDigit(5));
    act(() => result.current.onDigit(0));

    expect(result.current.amountShekels).toBe(50);
    expect(result.current.canSubmit).toBe(true);
    expect(result.current.isOverdraft).toBe(false);
  });

  it('flags an overdraft and blocks submit when amount exceeds the wallet balance', () => {
    const { result } = setup();

    act(() => result.current.onDigit(9));
    act(() => result.current.onDigit(9));

    expect(result.current.isOverdraft).toBe(true);
    expect(result.current.canSubmit).toBe(false);
  });

  it('marks a good-deeds withdrawal as a donation', () => {
    const { result } = setup();

    act(() => result.current.onSelectWallet(goodDeeds.id));

    expect(result.current.selectedWalletId).toBe(goodDeeds.id);
    expect(result.current.isDonation).toBe(true);
  });

  it('submits the withdrawal, refreshes, and closes on submit', async () => {
    const { result } = setup();

    act(() => result.current.onDigit(1));
    act(() => result.current.onDigit(0));
    act(() => result.current.onSubmit());

    await waitFor(() =>
      expect(mockAddWithdrawal).toHaveBeenCalledWith(spending.id, 10)
    );
    await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it('shows an error and stays open when the withdrawal fails', async () => {
    mockAddWithdrawal.mockRejectedValueOnce(new Error('boom'));
    const { result } = setup();

    act(() => result.current.onDigit(5));
    act(() => result.current.onSubmit());

    await waitFor(() =>
      expect(result.current.requestState).toBe(REQUEST_STATE.failed)
    );
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(result.current.amountShekels).toBe(5);
  });

  describe('with a goal not yet reached', () => {
    const mockAccountSavingForGoal = {
      ...mockAccountSummary,
      goal: createMockGoal({ amount: savings.balance + 100 }),
    };

    it('keeps savings from being submitted', () => {
      const { result } = setup(mockAccountSavingForGoal);

      act(() => result.current.onSelectWallet(savings.id));
      act(() => result.current.onDigit(5));

      expect(result.current.canSubmit).toBe(false);
    });

    it('says which goal savings are locked for once picked', () => {
      const { result } = setup(mockAccountSavingForGoal);

      act(() => result.current.onSelectWallet(savings.id));

      expect(result.current.savingsLockedFor?.goal).toBe(
        mockAccountSavingForGoal.goal
      );
    });

    it('lets another wallet be submitted', () => {
      const { result } = setup(mockAccountSavingForGoal);

      act(() => result.current.onDigit(5));

      expect(result.current.canSubmit).toBe(true);
    });
  });

  describe('with a goal reached', () => {
    const mockAccountWithGoalReached = {
      ...mockAccountSummary,
      goal: createMockGoal({ amount: savings.balance }),
    };

    it('lets savings be submitted', () => {
      const { result } = setup(mockAccountWithGoalReached);

      act(() => result.current.onSelectWallet(savings.id));
      act(() => result.current.onDigit(5));

      expect(result.current.canSubmit).toBe(true);
    });

    it('names the goal a savings withdrawal completes', () => {
      const { result } = setup(mockAccountWithGoalReached);

      act(() => result.current.onSelectWallet(savings.id));

      expect(result.current.goalToComplete).toBe(
        mockAccountWithGoalReached.goal
      );
    });

    it('completes no goal from another wallet', () => {
      const { result } = setup(mockAccountWithGoalReached);

      expect(result.current.goalToComplete).toBeUndefined();
    });
  });
});
