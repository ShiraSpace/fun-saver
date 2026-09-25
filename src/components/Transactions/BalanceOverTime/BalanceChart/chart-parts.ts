import { css, type SerializedStyles, type Theme } from '@emotion/react';
import styled from '@emotion/styled';
import type { ThemeColors } from '@/theme/theme-tokens';
import { SHOWN_BALANCE, type ShownBalance } from '../../constants';
import { WALLET_CHART_COLOR } from '../constants';

export function shownBalanceColor(
  colors: ThemeColors,
  shownBalance: ShownBalance
): string {
  return shownBalance === SHOWN_BALANCE.totalBalance
    ? colors.textStrong
    : colors[WALLET_CHART_COLOR[shownBalance]];
}

export function readableOverLines({
  theme,
}: {
  theme: Theme;
}): SerializedStyles {
  return css`
    paint-order: stroke;
    stroke: ${theme.colors.surface};
    stroke-linejoin: round;
  `;
}

export const AxisText = styled.text`
  ${readableOverLines}
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 500;
  stroke-width: 2.5px;
  fill: ${({ theme }): string => theme.colors.textMuted};
`;
