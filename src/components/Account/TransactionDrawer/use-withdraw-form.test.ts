import { act, renderHook, waitFor } from '@testing-library/react';
import { useWithdrawForm } from './use-withdraw-form';
import { mockDerivedWallets } from '@/test-support/fixtures';

const mockWithdraw = jest.fn();
const mockRefresh = jest.fn();
const onClose = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: (): { refresh: jest.Mock } => ({ refresh: mockRefresh }),
}));

jest.mock('./use-add-transaction', () => ({
  useAddTransaction: (): { addDeposit: jest.Mock; withdraw: jest.Mock } => ({
    addDeposit: jest.fn(),
    withdraw: mockWithdraw,
  }),
}));

const ACCOUNT_ID = 'a1';
const [savings, , goodDeeds] = mockDerivedWallets;

function setup(): ReturnType<
  typeof renderHook<ReturnType<typeof useWithdrawForm>, void>
> {
  return renderHook(() =>
    useWithdrawForm(ACCOUNT_ID, mockDerivedWallets, onClose)
  );
}

describe('useWithdrawForm', () => {
  beforeEach(() => {
    mockWithdraw.mockReset().mockResolvedValue(undefined);
    mockRefresh.mockClear();
    onClose.mockClear();
  });

  it('selects the first wallet by default', () => {
    const { result } = setup();

    expect(result.current.selectedId).toBe(savings.id);
    expect(result.current.amount).toBe(0);
    expect(result.current.canSubmit).toBe(false);
  });

  it('builds the amount from tapped digits', () => {
    const { result } = setup();

    act(() => result.current.onDigit(5));
    act(() => result.current.onDigit(0));

    expect(result.current.amount).toBe(50);
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

    expect(result.current.selectedId).toBe(goodDeeds.id);
    expect(result.current.isDonation).toBe(true);
  });

  it('submits the withdrawal, refreshes, and closes on confirm', async () => {
    const { result } = setup();

    act(() => result.current.onDigit(1));
    act(() => result.current.onDigit(0));
    act(() => result.current.onConfirm());

    await waitFor(() =>
      expect(mockWithdraw).toHaveBeenCalledWith(savings.id, 10)
    );
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('shows an error and stays open when the withdrawal fails', async () => {
    mockWithdraw.mockRejectedValueOnce(new Error('boom'));
    const { result } = setup();

    act(() => result.current.onDigit(5));
    act(() => result.current.onConfirm());

    await waitFor(() => expect(result.current.hasError).toBe(true));
    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.amount).toBe(5);
  });
});
