import { act, renderHook, waitFor } from '@testing-library/react';
import { REQUEST_STATE } from '@/lib/request-state';
import { useWithdrawalForm } from './use-withdrawal-form';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';

const mockAddWithdrawal = jest.fn();
const mockOnSaved = jest.fn();

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
const [, spending, goodDeeds] = mockWalletSummaries;

function setup(): ReturnType<
  typeof renderHook<ReturnType<typeof useWithdrawalForm>, void>
> {
  return renderHook(() =>
    useWithdrawalForm(mockAccountId, mockWalletSummaries, mockOnSaved)
  );
}

describe('useWithdrawalForm', () => {
  beforeEach(() => {
    mockAddWithdrawal.mockReset().mockResolvedValue(undefined);
    mockOnSaved.mockClear();
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

  it('withdraws the typed amount from the selected wallet', async () => {
    const { result } = setup();

    act(() => result.current.onDigit(1));
    act(() => result.current.onDigit(0));
    act(() => result.current.onSubmit());

    await waitFor(() =>
      expect(mockAddWithdrawal).toHaveBeenCalledWith(spending.id, 10)
    );
  });

  it('reports the withdrawal saved', async () => {
    const { result } = setup();

    act(() => result.current.onDigit(5));
    act(() => result.current.onSubmit());

    await waitFor(() => expect(mockOnSaved).toHaveBeenCalled());
  });

  it('fails, and does not report it saved, when the withdrawal fails', async () => {
    mockAddWithdrawal.mockRejectedValueOnce(new Error('boom'));
    const { result } = setup();

    act(() => result.current.onDigit(5));
    act(() => result.current.onSubmit());

    await waitFor(() =>
      expect(result.current.requestState).toBe(REQUEST_STATE.failed)
    );
    expect(mockOnSaved).not.toHaveBeenCalled();
    expect(result.current.amountShekels).toBe(5);
  });
});
