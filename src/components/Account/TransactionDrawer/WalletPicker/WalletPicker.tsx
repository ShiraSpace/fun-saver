'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { withoutAgorot } from '@/lib/money';
import {
  savedTowardGoalIn,
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
  return (
    <Wallets>
      {wallets.map((wallet) => {
        const savedInWallet = savedTowardGoalIn(wallet, savedTowardGoal);
        const tileAmount = savedInWallet
          ? withoutAgorot(wallet.balance)
          : wallet.balance;

        return (
          <WalletTile
            key={wallet.id}
            walletName={wallet.name}
            icon={wallet.icon}
            amountAgorot={tileAmount}
            testId={WALLET_PICKER_TEST_IDS.wallet(wallet.name)}
            amountTestId={WALLET_PICKER_TEST_IDS.balance(wallet.name)}
            selected={wallet.id === selectedWalletId}
            onSelect={(): void => onSelect(wallet.id)}
            locked={savingsLocked(savedInWallet)}
          />
        );
      })}
    </Wallets>
  );
}
