'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { agorotToShekels } from '@/lib/money';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { WalletTile } from '../WalletTile';
import { WALLET_PICKER_COPY, WALLET_PICKER_TEST_IDS } from './constants';
import { Wallets } from './WalletPicker.styles';

type WalletOption = Pick<WalletSummary, 'id' | 'name' | 'icon' | 'balance'>;

interface WalletPickerProps {
  wallets: WalletOption[];
  selectedWalletId: string;
  onSelect: (walletId: string) => void;
  savedTowardGoal?: SavedTowardGoal;
}

function savingsLockNote(
  savedTowardGoal?: SavedTowardGoal
): string | undefined {
  if (!savedTowardGoal || savedTowardGoal.reached) {
    return;
  }

  return WALLET_PICKER_COPY.stillToSave(
    agorotToShekels(savedTowardGoal.stillToSave)
  );
}

export function WalletPicker({
  wallets,
  selectedWalletId,
  onSelect,
  savedTowardGoal,
}: WalletPickerProps): JSX.Element {
  const goalOf = (wallet: WalletOption): SavedTowardGoal | undefined =>
    wallet.name === WALLET_NAMES.savings ? savedTowardGoal : undefined;

  return (
    <Wallets>
      {wallets.map((wallet) => (
        <WalletTile
          key={wallet.id}
          walletName={wallet.name}
          icon={wallet.icon}
          amountAgorot={goalOf(wallet)?.saved ?? wallet.balance}
          testId={WALLET_PICKER_TEST_IDS.wallet(wallet.name)}
          amountTestId={WALLET_PICKER_TEST_IDS.balance(wallet.name)}
          selected={wallet.id === selectedWalletId}
          onSelect={(): void => onSelect(wallet.id)}
          lockNote={savingsLockNote(goalOf(wallet))}
        />
      ))}
    </Wallets>
  );
}
