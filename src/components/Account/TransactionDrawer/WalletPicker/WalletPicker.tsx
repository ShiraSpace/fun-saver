'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { withoutAgorot } from '@/lib/money';
import {
  savingsLocked,
  type SavedTowardGoal,
} from '@/lib/goal/saved-toward-goal';
import { WalletTile } from '../WalletTile';
import { WALLET_PICKER_TEST_IDS } from './constants';
import { Wallets } from './WalletPicker.styles';

type WalletOption = Pick<WalletSummary, 'id' | 'name' | 'icon' | 'balance'>;

interface WalletPickerProps {
  wallets: WalletOption[];
  selectedWalletId: string;
  onSelect: (walletId: string) => void;
  savedTowardGoal?: SavedTowardGoal;
}

export function WalletPicker({
  wallets,
  selectedWalletId,
  onSelect,
  savedTowardGoal,
}: WalletPickerProps): JSX.Element {
  const isSavingsLocked = savingsLocked(savedTowardGoal);

  return (
    <Wallets>
      {wallets.map((wallet) => {
        const isSavings = wallet.name === WALLET_NAMES.savings;

        return (
          <WalletTile
            key={wallet.id}
            walletName={wallet.name}
            icon={wallet.icon}
            amountAgorot={
              isSavings && savedTowardGoal
                ? withoutAgorot(wallet.balance)
                : wallet.balance
            }
            testId={WALLET_PICKER_TEST_IDS.wallet(wallet.name)}
            amountTestId={WALLET_PICKER_TEST_IDS.balance(wallet.name)}
            selected={wallet.id === selectedWalletId}
            onSelect={(): void => onSelect(wallet.id)}
            locked={isSavings && isSavingsLocked}
          />
        );
      })}
    </Wallets>
  );
}
