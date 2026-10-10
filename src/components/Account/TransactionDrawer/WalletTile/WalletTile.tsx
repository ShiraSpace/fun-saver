'use client';

import { JSX } from 'react';
import type { WalletName } from '@/lib/wallet/types';
import { Money } from '@/components/Money';
import { WALLET_CARD_COPY } from '../../WalletCard/constants';
import { WALLET_TILE_COPY, WALLET_TILE_TEST_IDS } from './constants';
import {
  Tile,
  Head,
  WalletIcon,
  Name,
  Amount,
  LockTag,
  LockNote,
} from './WalletTile.styles';

interface WalletTileProps {
  walletName: WalletName;
  icon: string;
  amountAgorot: number;
  amountTestId: string;
  testId?: string;
  selected?: boolean;
  onSelect?: () => void;
  lockNote?: string;
}

export function WalletTile({
  walletName,
  icon,
  amountAgorot,
  amountTestId,
  testId,
  selected = false,
  onSelect,
  lockNote,
}: WalletTileProps): JSX.Element {
  const isSelectable = Boolean(onSelect);

  return (
    <Tile
      type="button"
      data-testid={testId}
      disabled={!isSelectable}
      aria-pressed={isSelectable ? selected : undefined}
      selected={selected}
      locked={Boolean(lockNote)}
      onClick={onSelect}
    >
      {lockNote && (
        <LockTag aria-hidden="true">{WALLET_TILE_COPY.lock}</LockTag>
      )}
      <Head>
        <WalletIcon walletName={walletName}>{icon}</WalletIcon>
        <Name>{WALLET_CARD_COPY.name[walletName]}</Name>
      </Head>
      <Amount>
        <Money amountAgorot={amountAgorot} testId={amountTestId} />
      </Amount>
      {lockNote && (
        <LockNote data-testid={WALLET_TILE_TEST_IDS.lockNote}>
          {lockNote}
        </LockNote>
      )}
    </Tile>
  );
}
