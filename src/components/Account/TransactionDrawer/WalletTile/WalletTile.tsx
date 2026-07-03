'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { WalletName } from '@/lib/types';
import { Money } from '@/components/Money';
import { WALLET_CARD_COPY, WALLET_GRADIENT } from '../../WalletCard/constants';
import { WALLET_TILE_STYLE } from './constants';

const Tile = styled.button<{ selected: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${WALLET_TILE_STYLE.contentGap}px;
  border-radius: ${WALLET_TILE_STYLE.radius}px;
  border: ${WALLET_TILE_STYLE.borderWidth}px solid
    ${({ theme, selected }): string =>
      selected ? theme.colors.primary : 'transparent'};
  background: ${({ theme }): string => theme.colors.softBg};
  cursor: pointer;
  font-family: inherit;
  padding: 8px 0;

  &:disabled {
    cursor: default;
    opacity: ${WALLET_TILE_STYLE.disabledOpacity};
  }
`;

const Head = styled.span`
  display: flex;
  align-items: center;
  gap: ${WALLET_TILE_STYLE.headGap}px;
`;

const IconTile = styled.span<{ name: WalletName }>`
  width: ${WALLET_TILE_STYLE.iconSize}px;
  height: ${WALLET_TILE_STYLE.iconSize}px;
  border-radius: ${WALLET_TILE_STYLE.iconRadius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${WALLET_TILE_STYLE.iconFontSize}px;
  background: ${({ theme, name }): string =>
    theme.gradients[WALLET_GRADIENT[name]]};
`;

const Name = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  white-space: nowrap;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

const Value = styled.span`
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

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
