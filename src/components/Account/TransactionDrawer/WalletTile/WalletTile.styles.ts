import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { WalletName } from '@/lib/wallet/types';
import { WALLET_GRADIENT } from '@/theme/wallet-gradient';
import { WALLET_TILE_STYLE } from './constants';

interface TileState {
  selected: boolean;
  locked: boolean;
}

function tileBorderColor({
  theme,
  selected,
  locked,
}: TileState & { theme: Theme }): string {
  if (!selected) {
    return 'transparent';
  }

  return locked ? theme.colors.textMuted : theme.colors.primary;
}

export const Tile = styled.button<TileState>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${WALLET_TILE_STYLE.contentGap}px;
  border-radius: ${WALLET_TILE_STYLE.radius}px;
  border: ${WALLET_TILE_STYLE.borderWidth}px
    ${({ locked }): string => (locked ? 'dashed' : 'solid')} ${tileBorderColor};
  background: ${({ theme }): string => theme.colors.softBg};
  cursor: pointer;
  font-family: inherit;
  padding: 8px 0;
  filter: ${({ locked }): string => (locked ? 'grayscale(1)' : 'none')};

  &:disabled {
    cursor: default;
    opacity: ${WALLET_TILE_STYLE.disabledOpacity};
  }
`;

export const Head = styled.span`
  display: flex;
  align-items: center;
  gap: ${WALLET_TILE_STYLE.headGap}px;
`;

export const WalletIcon = styled.span<{ walletName: WalletName }>`
  width: ${WALLET_TILE_STYLE.iconSize}px;
  height: ${WALLET_TILE_STYLE.iconSize}px;
  border-radius: ${WALLET_TILE_STYLE.iconRadius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${WALLET_TILE_STYLE.iconFontSize}px;
  background: ${({ theme, walletName }): string =>
    theme.gradients[WALLET_GRADIENT[walletName]]};
`;

export const Name = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  white-space: nowrap;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Amount = styled.span`
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const LockTag = styled.span`
  position: absolute;
  top: -8px;
  inset-inline-end: 6px;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 11px;
  background: ${({ theme }): string => theme.colors.surface};
  box-shadow: 0 1px 3px ${({ theme }): string => theme.shadows.mid};
`;
