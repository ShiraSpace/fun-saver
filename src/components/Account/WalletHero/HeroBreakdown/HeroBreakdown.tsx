'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { Money } from '../../Money/Money';
import {
  HERO_STYLE,
  WALLET_HERO_COPY,
  WALLET_HERO_TEST_IDS,
} from '../constants';

type CellTone = 'deposits' | 'gain';

interface CellProps {
  tone: CellTone;
}

const Row = styled.div`
  display: flex;
  gap: ${HERO_STYLE.breakdownGap}px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
`;

const Cell = styled.div<CellProps>`
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

const Label = styled.div`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.textMuted};
  margin-bottom: 4px;
`;

const Amount = styled.div`
  font-size: ${({ theme }): number => theme.typography.title}px;
`;

interface BreakdownCellProps {
  tone: CellTone;
  label: string;
  amountAgorot: number;
  testId: string;
}

function BreakdownCell({
  tone,
  label,
  amountAgorot,
  testId,
}: BreakdownCellProps): JSX.Element {
  return (
    <Cell tone={tone}>
      <Label>{label}</Label>
      <Amount>
        <Money amountAgorot={amountAgorot} testId={testId} />
      </Amount>
    </Cell>
  );
}

interface HeroBreakdownProps {
  principal: number;
  interestGain: number;
}

export function HeroBreakdown({
  principal,
  interestGain,
}: HeroBreakdownProps): JSX.Element {
  return (
    <Row>
      <BreakdownCell
        tone="deposits"
        label={WALLET_HERO_COPY.depositsLabel}
        amountAgorot={principal}
        testId={WALLET_HERO_TEST_IDS.deposits}
      />
      <BreakdownCell
        tone="gain"
        label={WALLET_HERO_COPY.interestGainLabel}
        amountAgorot={interestGain}
        testId={WALLET_HERO_TEST_IDS.interestGain}
      />
    </Row>
  );
}
