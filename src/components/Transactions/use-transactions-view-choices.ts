import { useState } from 'react';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { DEFAULT_RANGE, type RangeId } from './BalanceOverTime/constants';
import { SHOWN_BALANCE, type ShownBalance } from './constants';

export interface TransactionsViewChoices {
  range: RangeId;
  setRange: (range: RangeId) => void;
  shownBalances: readonly ShownBalance[];
  toggleShownBalance: (shownBalance: ShownBalance) => void;
  allWalletsShown: boolean;
  toggleAllWallets: () => void;
}

const SHOWN_BALANCE_ORDER: readonly ShownBalance[] =
  Object.values(SHOWN_BALANCE);

const DEFAULT_SHOWN_BALANCES: readonly ShownBalance[] = [
  SHOWN_BALANCE.totalBalance,
];

function inShownBalanceOrder(
  shownBalances: readonly ShownBalance[]
): ShownBalance[] {
  return SHOWN_BALANCE_ORDER.filter((shownBalance) =>
    shownBalances.includes(shownBalance)
  );
}

function withShownBalanceToggled(
  shownBalances: readonly ShownBalance[],
  shownBalance: ShownBalance
): ShownBalance[] {
  const isShown = shownBalances.includes(shownBalance);

  return inShownBalanceOrder(
    isShown
      ? shownBalances.filter((otherBalance) => otherBalance !== shownBalance)
      : [...shownBalances, shownBalance]
  );
}

function allWalletsShownIn(shownBalances: readonly ShownBalance[]): boolean {
  return WALLET_NAMES.every((walletName) => shownBalances.includes(walletName));
}

function withAllWalletsToggled(
  shownBalances: readonly ShownBalance[]
): ShownBalance[] {
  const keptTotalBalance = shownBalances.filter(
    (shownBalance) => shownBalance === SHOWN_BALANCE.totalBalance
  );

  return allWalletsShownIn(shownBalances)
    ? keptTotalBalance
    : inShownBalanceOrder([...keptTotalBalance, ...WALLET_NAMES]);
}

export function useTransactionsViewChoices(): TransactionsViewChoices {
  const [range, setRange] = useState<RangeId>(DEFAULT_RANGE);
  const [shownBalances, setShownBalances] = useState<readonly ShownBalance[]>(
    DEFAULT_SHOWN_BALANCES
  );

  return {
    range,
    setRange,
    shownBalances,
    toggleShownBalance: (shownBalance): void =>
      setShownBalances((current) =>
        withShownBalanceToggled(current, shownBalance)
      ),
    allWalletsShown: allWalletsShownIn(shownBalances),
    toggleAllWallets: (): void => setShownBalances(withAllWalletsToggled),
  };
}
