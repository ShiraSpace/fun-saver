'use client';

import { JSX } from 'react';
import type { WalletName } from '@/lib/wallet/types';
import { Money } from '@/components/Money';
import { WALLET_CARD_COPY } from '../../WalletCard/constants';
import { GOAL_COPY } from '@/components/Goal/constants';
import { WALLET_TILE_TEST_IDS } from './constants';
import {
  Tile,
  Head,
  WalletIcon,
  Name,
  Amount,
  LockTag,
} from './WalletTile.styles';

interface WalletTileProps {
  walletName: WalletName;
  icon: string;
  amountAgorot: number;
  amountTestId: string;
  testId?: string;
  selected?: boolean;
  onSelect?: () => void;
  locked?: boolean;
}

export function WalletTile({
  walletName,
  icon,
  amountAgorot,
  amountTestId,
  testId,
  selected = false,
  onSelect,
  locked = false,
}: WalletTileProps): JSX.Element {
  const isSelectable = Boolean(onSelect);

  return (
    <Tile
      type="button"
      data-testid={testId}
      disabled={!isSelectable}
      aria-pressed={isSelectable ? selected : undefined}
      selected={selected}
      locked={locked}
      onClick={onSelect}
    >
      {locked && (
        <LockTag aria-hidden="true" data-testid={WALLET_TILE_TEST_IDS.lock}>
          {GOAL_COPY.lock}
        </LockTag>
      )}
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
