'use client';

import { JSX } from 'react';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import type { ShownBalance } from '../../use-transactions-view-choices';
import { BalanceChip } from '../chip-parts';
import { shownBalanceLabel } from '../constants';
import { BALANCE_CHIPS_TEST_IDS } from './constants';
import { Chips, Swatch, TotalBalanceChip } from './BalanceChips.styles';

interface BalanceChipsProps {
  shownBalances: readonly ShownBalance[];
  onToggle: (shownBalance: ShownBalance) => void;
}

export function BalanceChips({
  shownBalances,
  onToggle,
}: BalanceChipsProps): JSX.Element {
  const walletChips = WALLET_NAMES.map((walletName) => (
    <BalanceChip
      key={walletName}
      type="button"
      aria-pressed={shownBalances.includes(walletName)}
      onClick={(): void => onToggle(walletName)}
      data-testid={BALANCE_CHIPS_TEST_IDS.chip(walletName)}
    >
      <Swatch walletName={walletName} />
      {shownBalanceLabel(walletName)}
    </BalanceChip>
  ));

  return (
    <Chips>
      <TotalBalanceChip
        type="button"
        aria-pressed={shownBalances.includes('totalBalance')}
        onClick={(): void => onToggle('totalBalance')}
        data-testid={BALANCE_CHIPS_TEST_IDS.chip('totalBalance')}
      >
        {shownBalanceLabel('totalBalance')}
      </TotalBalanceChip>
      {walletChips}
    </Chips>
  );
}
