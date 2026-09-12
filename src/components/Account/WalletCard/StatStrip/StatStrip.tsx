'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { halfShekelAmount } from '@/lib/money';
import { Money } from '@/components/Money';
import {
  STAT_STRIP_COPY,
  STAT_STRIP_STYLE,
  STAT_STRIP_TEST_IDS,
} from './constants';

type StatTone = 'deposits' | 'gain';

const Strip = styled.div`
  display: flex;
  gap: ${STAT_STRIP_STYLE.gap}px;
  margin-top: ${STAT_STRIP_STYLE.marginTop}px;
  padding-top: ${STAT_STRIP_STYLE.paddingTop}px;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
`;

const Cell = styled.div<{ tone: StatTone }>`
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

const Label = styled.span<{ tone: StatTone }>`
  font-size: ${STAT_STRIP_STYLE.labelSize}px;
  font-weight: 600;
  color: ${({ tone, theme }): string =>
    tone === 'gain' ? theme.colors.gainText : theme.colors.textMuted};
  opacity: ${({ tone }): number =>
    tone === 'gain' ? STAT_STRIP_STYLE.labelOpacity : 1};
`;

const Amount = styled.span`
  font-size: ${STAT_STRIP_STYLE.amountSize}px;
`;

interface StatProps {
  tone: StatTone;
  label: string;
  amountAgorot: number;
  testId: string;
  allowHalf?: boolean;
  showSign?: boolean;
}

function Stat({
  tone,
  label,
  amountAgorot,
  testId,
  allowHalf,
  showSign,
}: StatProps): JSX.Element {
  return (
    <Cell tone={tone}>
      <Label tone={tone}>{label}</Label>
      <Amount>
        <Money
          amountAgorot={amountAgorot}
          testId={testId}
          allowHalf={allowHalf}
          showSign={showSign}
        />
      </Amount>
    </Cell>
  );
}

interface StatStripProps {
  principal: number;
  interestGain: number;
  todayInterest: number;
}

export function StatStrip({
  principal,
  interestGain,
  todayInterest,
}: StatStripProps): JSX.Element {
  return (
    <Strip data-testid={STAT_STRIP_TEST_IDS.strip}>
      <Stat
        tone="deposits"
        label={STAT_STRIP_COPY.depositsLabel}
        amountAgorot={principal}
        testId={STAT_STRIP_TEST_IDS.deposits}
      />
      <Stat
        tone="gain"
        label={STAT_STRIP_COPY.interestGainLabel}
        amountAgorot={interestGain}
        testId={STAT_STRIP_TEST_IDS.interestGain}
      />
      {halfShekelAmount(todayInterest) !== null && (
        <Stat
          tone="gain"
          label={STAT_STRIP_COPY.todayLabel}
          amountAgorot={todayInterest}
          testId={STAT_STRIP_TEST_IDS.todayInterest}
          allowHalf
          showSign
        />
      )}
    </Strip>
  );
}
