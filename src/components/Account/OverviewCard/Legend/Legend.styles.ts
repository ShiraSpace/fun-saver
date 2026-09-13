import styled from '@emotion/styled';
import type { WalletName } from '@/lib/types';
import { OVERVIEW_CARD_STYLE, WALLET_ARC_COLOR } from '../constants';

export const List = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${OVERVIEW_CARD_STYLE.legendGap}px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${OVERVIEW_CARD_STYLE.legendRowGap}px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 600;
`;

export const Dot = styled.span<{ walletName: WalletName }>`
  flex-shrink: 0;
  width: ${OVERVIEW_CARD_STYLE.dotSize}px;
  height: ${OVERVIEW_CARD_STYLE.dotSize}px;
  border-radius: ${OVERVIEW_CARD_STYLE.dotRadius}px;
  background: ${({ walletName, theme }): string =>
    theme.colors[WALLET_ARC_COLOR[walletName]]};
`;

export const Share = styled.span`
  font-size: ${OVERVIEW_CARD_STYLE.shareSize}px;
  font-weight: 500;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Leader = styled.span`
  flex: 1;
  border-bottom: ${OVERVIEW_CARD_STYLE.leaderWidth}px dotted
    ${({ theme }): string => theme.colors.divider};
  margin-bottom: ${OVERVIEW_CARD_STYLE.leaderOffset}px;
`;
