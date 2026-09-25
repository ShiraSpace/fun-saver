import { keyframes, type SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import type { WalletName } from '@/lib/wallet/types';
import { EASING, entrance } from '@/theme/motion';
import {
  LEGEND_ANIMATION,
  BALANCE_BREAKDOWN_STYLE,
  WALLET_COLOR,
} from '../constants';

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(${LEGEND_ANIMATION.riseFromPx}px);
  }
`;

export const List = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${BALANCE_BREAKDOWN_STYLE.legendGap}px;
`;

export const Row = styled.div<{ rowIndex: number }>`
  display: flex;
  align-items: center;
  gap: ${BALANCE_BREAKDOWN_STYLE.legendRowGap}px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 600;
  ${({ rowIndex }): SerializedStyles =>
    entrance({
      keyframes: fadeUp,
      durationMs: LEGEND_ANIMATION.riseMs,
      delayMs:
        LEGEND_ANIMATION.delayMs + rowIndex * LEGEND_ANIMATION.betweenRowsMs,
      easing: EASING.easeOut,
    })}
`;

export const Dot = styled.span<{ walletName: WalletName }>`
  flex-shrink: 0;
  width: ${BALANCE_BREAKDOWN_STYLE.dotSize}px;
  height: ${BALANCE_BREAKDOWN_STYLE.dotSize}px;
  border-radius: ${BALANCE_BREAKDOWN_STYLE.dotRadius}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${BALANCE_BREAKDOWN_STYLE.dotFontSize}px;
  line-height: 1;
  background: ${({ walletName, theme }): string =>
    theme.colors[WALLET_COLOR[walletName]]};
`;

export const Share = styled.span`
  font-size: ${BALANCE_BREAKDOWN_STYLE.shareSize}px;
  font-weight: 500;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Leader = styled.span`
  flex: 1;
  border-bottom: ${BALANCE_BREAKDOWN_STYLE.leaderWidth}px dotted
    ${({ theme }): string => theme.colors.divider};
  margin-bottom: ${BALANCE_BREAKDOWN_STYLE.leaderOffset}px;
`;
