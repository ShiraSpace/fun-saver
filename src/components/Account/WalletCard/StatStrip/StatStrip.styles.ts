import styled from '@emotion/styled';
import { STAT_STRIP_STYLE } from './constants';
import type { StatTone } from './StatStrip';

export const Strip = styled.div`
  display: flex;
  gap: ${STAT_STRIP_STYLE.gap}px;
  margin-top: ${STAT_STRIP_STYLE.marginTop}px;
  padding-top: ${STAT_STRIP_STYLE.paddingTop}px;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
`;

export const Cell = styled.div<{ tone: StatTone }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${STAT_STRIP_STYLE.cellGap}px;
  padding: ${STAT_STRIP_STYLE.cellPaddingY}px ${STAT_STRIP_STYLE.cellPaddingX}px;
  border-radius: ${STAT_STRIP_STYLE.cellRadius}px;
  background: ${({ tone, theme }): string =>
    tone === 'gain' ? theme.colors.gainSoftBg : theme.colors.depositBg};
  color: ${({ tone, theme }): string =>
    tone === 'gain' ? theme.colors.gainText : theme.colors.textStrong};
`;

export const Label = styled.span<{ tone: StatTone }>`
  font-size: ${STAT_STRIP_STYLE.labelSize}px;
  font-weight: 600;
  color: ${({ tone, theme }): string =>
    tone === 'gain' ? theme.colors.gainText : theme.colors.textMuted};
  opacity: ${({ tone }): number =>
    tone === 'gain' ? STAT_STRIP_STYLE.labelOpacity : 1};
`;

export const Amount = styled.span`
  font-size: ${STAT_STRIP_STYLE.amountSize}px;
`;
