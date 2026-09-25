import { act, renderHook } from '@testing-library/react';
import { SHOWN_BALANCE } from './constants';
import {
  useTransactionsViewChoices,
  type TransactionsViewChoices,
} from './use-transactions-view-choices';

function shownBalancesAfter(
  choose: (viewChoices: () => TransactionsViewChoices) => void
): TransactionsViewChoices['shownBalances'] {
  const { result } = renderHook(() => useTransactionsViewChoices());

  choose(() => result.current);

  return result.current.shownBalances;
}

describe('the balances the chart shows', () => {
  it('shows the total and no wallet at first', () => {
    expect(shownBalancesAfter(() => undefined)).toEqual([
      SHOWN_BALANCE.totalBalance,
    ]);
  });

  it('turns one wallet on without touching the others', () => {
    const shownBalances = shownBalancesAfter((viewChoices) => {
      act(() => viewChoices().toggleShownBalance(SHOWN_BALANCE.savings));
    });

    expect(shownBalances).toEqual([
      SHOWN_BALANCE.totalBalance,
      SHOWN_BALANCE.savings,
    ]);
  });

  it('keeps the lines in one order, whatever order they were turned on in', () => {
    const shownBalances = shownBalancesAfter((viewChoices) => {
      act(() => viewChoices().toggleShownBalance(SHOWN_BALANCE.goodDeeds));
      act(() => viewChoices().toggleShownBalance(SHOWN_BALANCE.savings));
    });

    expect(shownBalances).toEqual([
      SHOWN_BALANCE.totalBalance,
      SHOWN_BALANCE.savings,
      SHOWN_BALANCE.goodDeeds,
    ]);
  });

  it('turns all three wallets on together', () => {
    const shownBalances = shownBalancesAfter((viewChoices) => {
      act(() => viewChoices().toggleAllWallets());
    });

    expect(shownBalances).toEqual([
      SHOWN_BALANCE.totalBalance,
      SHOWN_BALANCE.savings,
      SHOWN_BALANCE.spending,
      SHOWN_BALANCE.goodDeeds,
    ]);
  });

  it('turns all three wallets off again', () => {
    const shownBalances = shownBalancesAfter((viewChoices) => {
      act(() => viewChoices().toggleAllWallets());
      act(() => viewChoices().toggleAllWallets());
    });

    expect(shownBalances).toEqual([SHOWN_BALANCE.totalBalance]);
  });

  it('leaves the total as it was when every wallet is turned on', () => {
    const shownBalances = shownBalancesAfter((viewChoices) => {
      act(() => viewChoices().toggleShownBalance(SHOWN_BALANCE.totalBalance));
      act(() => viewChoices().toggleAllWallets());
    });

    expect(shownBalances).toEqual([
      SHOWN_BALANCE.savings,
      SHOWN_BALANCE.spending,
      SHOWN_BALANCE.goodDeeds,
    ]);
  });

  it('reports every wallet as shown once all three are on', () => {
    const { result } = renderHook(() => useTransactionsViewChoices());

    act(() => result.current.toggleShownBalance(SHOWN_BALANCE.savings));
    act(() => result.current.toggleShownBalance(SHOWN_BALANCE.spending));
    act(() => result.current.toggleShownBalance(SHOWN_BALANCE.goodDeeds));

    expect(result.current.allWalletsShown).toBe(true);
  });

  it('does not report every wallet as shown while one is still off', () => {
    const { result } = renderHook(() => useTransactionsViewChoices());

    act(() => result.current.toggleShownBalance(SHOWN_BALANCE.savings));
    act(() => result.current.toggleShownBalance(SHOWN_BALANCE.spending));

    expect(result.current.allWalletsShown).toBe(false);
  });
});
