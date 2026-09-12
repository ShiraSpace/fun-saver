'use client';

import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { WalletTile } from '../WalletTile';
import { WALLET_PICKER_TEST_IDS } from './constants';
import { Row } from './WalletPicker.styles';

type WalletOption = Pick<WalletWithDerived, 'id' | 'name' | 'icon' | 'balance'>;

interface WalletPickerProps {
  wallets: WalletOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function WalletPicker({
  wallets,
  selectedId,
  onSelect,
}: WalletPickerProps): JSX.Element {
  return (
    <Row>
      {wallets.map((wallet) => (
        <WalletTile
          key={wallet.id}
          name={wallet.name}
          icon={wallet.icon}
          amountAgorot={wallet.balance}
          tileTestId={WALLET_PICKER_TEST_IDS.wallet(wallet.name)}
          valueTestId={WALLET_PICKER_TEST_IDS.balance(wallet.name)}
          selected={wallet.id === selectedId}
          onSelect={(): void => onSelect(wallet.id)}
        />
      ))}
    </Row>
  );
}
