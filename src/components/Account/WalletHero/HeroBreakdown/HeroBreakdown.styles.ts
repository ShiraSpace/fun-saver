import styled from '@emotion/styled';
import { HERO_STYLE } from '../constants';

export type CellTone = 'deposits' | 'gain';

interface CellProps {
  tone: CellTone;
}

export const Row = styled.div`
  display: flex;
  gap: ${HERO_STYLE.breakdownGap}px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
`;

export const Cell = styled.div<CellProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${HERO_STYLE.cellPadding}px;
  border-radius: ${HERO_STYLE.cellRadius}px;
  background: ${({ tone, theme }): string =>
    tone === 'gain' ? theme.colors.gainSoftBg : theme.colors.depositBg};
  color: ${({ tone, theme }): string =>
    tone === 'gain' ? theme.colors.gainText : theme.colors.textStrong};
`;

export const Label = styled.div`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.textMuted};
  margin-bottom: 4px;
`;

export const Amount = styled.div`
  font-size: ${({ theme }): number => theme.typography.title}px;
`;
