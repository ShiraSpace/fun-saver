'use client';

import { JSX } from 'react';
import type { WalletName } from '@/lib/types';
import { Money } from '@/components/Money';
import { WALLET_CARD_COPY } from '../../WalletCard/constants';
import { Tile, Head, IconTile, Name, Value } from './WalletTile.styles';

interface WalletTileProps {
  name: WalletName;
  icon: string;
  amountAgorot: number;
  valueTestId: string;
  tileTestId?: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function WalletTile({
  name,
  icon,
  amountAgorot,
  valueTestId,
  tileTestId,
  selected = false,
  onSelect,
}: WalletTileProps): JSX.Element {
  const interactive = Boolean(onSelect);

  return (
    <Tile
      type="button"
      data-testid={tileTestId}
      disabled={!interactive}
      aria-pressed={interactive ? selected : undefined}
      selected={selected}
      onClick={onSelect}
    >
      <Head>
        <IconTile name={name}>{icon}</IconTile>
        <Name>{WALLET_CARD_COPY.name[name]}</Name>
      </Head>
      <Value>
        <Money amountAgorot={amountAgorot} testId={valueTestId} />
      </Value>
    </Tile>
  );
}
