import styled from '@emotion/styled';
import { INTEREST_STATS_STYLE } from './constants';
import type { StatTone } from './InterestStats';

export const Stats = styled.div`
  display: flex;
  gap: ${INTEREST_STATS_STYLE.gap}px;
  margin-top: ${INTEREST_STATS_STYLE.marginTop}px;
  padding-top: ${INTEREST_STATS_STYLE.paddingTop}px;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
`;

export const Cell = styled.div<{ tone: StatTone }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${INTEREST_STATS_STYLE.cellGap}px;
  padding: ${INTEREST_STATS_STYLE.cellPaddingY}px
    ${INTEREST_STATS_STYLE.cellPaddingX}px;
  border-radius: ${INTEREST_STATS_STYLE.cellRadius}px;
  background: ${({ tone, theme }): string =>
    tone === 'interest' ? theme.colors.gainSoftBg : theme.colors.depositBg};
  color: ${({ tone, theme }): string =>
    tone === 'interest' ? theme.colors.gainText : theme.colors.textStrong};
`;

export const Label = styled.span<{ tone: StatTone }>`
  font-size: ${INTEREST_STATS_STYLE.labelSize}px;
  font-weight: 600;
  color: ${({ tone, theme }): string =>
    tone === 'interest' ? theme.colors.gainText : theme.colors.textMuted};
`;

export const Amount = styled.span`
  font-size: ${INTEREST_STATS_STYLE.amountSize}px;
`;
