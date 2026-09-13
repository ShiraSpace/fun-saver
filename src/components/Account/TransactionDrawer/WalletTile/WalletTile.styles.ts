import styled from '@emotion/styled';
import type { WalletName } from '@/lib/types';
import { WALLET_GRADIENT } from '../../WalletCard/constants';
import { WALLET_TILE_STYLE } from './constants';

export const Tile = styled.button<{ selected: boolean }>`
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

export const Head = styled.span`
  display: flex;
  align-items: center;
  gap: ${WALLET_TILE_STYLE.headGap}px;
`;

export const IconTile = styled.span<{ name: WalletName }>`
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

export const Name = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  white-space: nowrap;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Value = styled.span`
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;
