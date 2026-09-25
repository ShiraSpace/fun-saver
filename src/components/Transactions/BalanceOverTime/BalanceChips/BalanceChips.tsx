'use client';

import { JSX } from 'react';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { SHOWN_BALANCE, type ShownBalance } from '../../constants';
import { BalanceChip } from '../chip-parts';
import { shownBalanceLabel } from '../constants';
import { BALANCE_CHIPS_TEST_IDS } from './constants';
import { Chips, Swatch, TotalBalanceChip } from './BalanceChips.styles';

interface BalanceChipsProps {
  shownBalances: readonly ShownBalance[];
  onToggle: (shownBalance: ShownBalance) => void;
}

interface ShownBalanceChip {
  isShown: boolean;
  toggle: () => void;
  testId: string;
  label: string;
}

function chipOf(
  shownBalance: ShownBalance,
  { shownBalances, onToggle }: BalanceChipsProps
): ShownBalanceChip {
  return {
    isShown: shownBalances.includes(shownBalance),
    toggle: (): void => onToggle(shownBalance),
    testId: BALANCE_CHIPS_TEST_IDS.chip(shownBalance),
    label: shownBalanceLabel(shownBalance),
  };
}

export function BalanceChips(props: BalanceChipsProps): JSX.Element {
  const totalBalanceChip = chipOf(SHOWN_BALANCE.totalBalance, props);
  const walletChips = WALLET_NAMES.map((walletName) => {
    const walletChip = chipOf(walletName, props);

    return (
      <BalanceChip
        key={walletName}
        type="button"
        aria-pressed={walletChip.isShown}
        onClick={walletChip.toggle}
        data-testid={walletChip.testId}
      >
        <Swatch walletName={walletName} />
        {walletChip.label}
      </BalanceChip>
    );
  });

  return (
    <Chips>
      <TotalBalanceChip
        type="button"
        aria-pressed={totalBalanceChip.isShown}
        onClick={totalBalanceChip.toggle}
        data-testid={totalBalanceChip.testId}
      >
        {totalBalanceChip.label}
      </TotalBalanceChip>
      {walletChips}
    </Chips>
  );
}
