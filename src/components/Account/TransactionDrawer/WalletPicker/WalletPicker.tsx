'use client';

import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { WalletTile } from '../WalletTile';
import { WALLET_PICKER_TEST_IDS } from './constants';
import { Wallets } from './WalletPicker.styles';

type WalletOption = Pick<WalletWithDerived, 'id' | 'name' | 'icon' | 'balance'>;

interface WalletPickerProps {
  wallets: WalletOption[];
  selectedWalletId: string;
  onSelect: (walletId: string) => void;
}

export function WalletPicker({
  wallets,
  selectedWalletId,
  onSelect,
}: WalletPickerProps): JSX.Element {
  return (
    <Wallets>
      {wallets.map((wallet) => (
        <WalletTile
          key={wallet.id}
          walletName={wallet.name}
          icon={wallet.icon}
          amountAgorot={wallet.balance}
          testId={WALLET_PICKER_TEST_IDS.wallet(wallet.name)}
          amountTestId={WALLET_PICKER_TEST_IDS.balance(wallet.name)}
          selected={wallet.id === selectedWalletId}
          onSelect={(): void => onSelect(wallet.id)}
        />
      ))}
    </Wallets>
  );
}
