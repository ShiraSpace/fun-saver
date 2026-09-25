'use client';

import { JSX } from 'react';
import type { WalletName } from '@/lib/wallet/types';
import { Money } from '@/components/Money';
import { WALLET_CARD_COPY } from '../../WalletCard/constants';
import { Tile, Head, WalletIcon, Name, Amount } from './WalletTile.styles';

interface WalletTileProps {
  walletName: WalletName;
  icon: string;
  amountAgorot: number;
  amountTestId: string;
  testId?: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function WalletTile({
  walletName,
  icon,
  amountAgorot,
  amountTestId,
  testId,
  selected = false,
  onSelect,
}: WalletTileProps): JSX.Element {
  const isSelectable = Boolean(onSelect);

  return (
    <Tile
      type="button"
      data-testid={testId}
      disabled={!isSelectable}
      aria-pressed={isSelectable ? selected : undefined}
      selected={selected}
      onClick={onSelect}
    >
      <Head>
        <WalletIcon walletName={walletName}>{icon}</WalletIcon>
        <Name>{WALLET_CARD_COPY.name[walletName]}</Name>
      </Head>
      <Amount>
        <Money amountAgorot={amountAgorot} testId={amountTestId} />
      </Amount>
    </Tile>
  );
}
