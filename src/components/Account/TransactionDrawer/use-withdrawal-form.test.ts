import { act, renderHook, waitFor } from '@testing-library/react';
import { useWithdrawalForm } from './use-withdrawal-form';
import { mockWalletSummaries } from '@/test-utils/fixtures';
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

const mockAccountId = 'a1';
const [savings, , goodDeeds] = mockWalletSummaries;

function setup(): ReturnType<
  typeof renderHook<ReturnType<typeof useWithdrawalForm>, void>
> {
  return renderHook(() =>
    useWithdrawalForm(mockAccountId, mockWalletSummaries, mockOnClose)
  );
}

describe('useWithdrawalForm', () => {
  beforeEach(() => {
    mockAddWithdrawal.mockReset().mockResolvedValue(undefined);
    mockRouter.refresh.mockClear();
    mockOnClose.mockClear();
  });

  it('selects the first wallet by default', () => {
    const { result } = setup();

    expect(result.current.selectedWalletId).toBe(savings.id);
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
      expect(mockAddWithdrawal).toHaveBeenCalledWith(savings.id, 10)
    );
    await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it('shows an error and stays open when the withdrawal fails', async () => {
    mockAddWithdrawal.mockRejectedValueOnce(new Error('boom'));
    const { result } = setup();

    act(() => result.current.onDigit(5));
    act(() => result.current.onSubmit());

    await waitFor(() => expect(result.current.hasError).toBe(true));
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(result.current.amountShekels).toBe(5);
  });
});
