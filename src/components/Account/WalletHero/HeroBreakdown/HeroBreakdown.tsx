'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { COLORS } from '@/theme/palette';
import { Money } from '../../Money/Money';
import {
  HERO_STYLE,
  WALLET_HERO_COPY,
  WALLET_HERO_TEST_IDS,
} from '../constants';

const Row = styled.div`
  display: flex;
  gap: ${HERO_STYLE.breakdownGap}px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: ${HERO_STYLE.divider};
`;

const Cell = styled.div<{ tone: 'deposits' | 'gain' }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${HERO_STYLE.cellPadding}px;
  border-radius: ${HERO_STYLE.cellRadius}px;
  background: ${({ tone }) =>
    tone === 'gain' ? HERO_STYLE.gainBg : HERO_STYLE.depositsBg};
  color: ${({ tone }) => (tone === 'gain' ? HERO_STYLE.gainText : COLORS.ink)};
`;

const Label = styled.div`
  font-size: ${HERO_STYLE.cellLabelSize}px;
  font-weight: 600;
  color: ${COLORS.muted};
  margin-bottom: 4px;
`;

const Amount = styled.div`
  font-size: ${HERO_STYLE.cellAmountSize}px;
`;

interface BreakdownCellProps {
  tone: 'deposits' | 'gain';
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
