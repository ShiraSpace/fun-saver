'use client';

import { JSX } from 'react';
import { halfShekelAmount } from '@/lib/money';
import { Money } from '@/components/Money';
import { STAT_STRIP_COPY, STAT_STRIP_TEST_IDS } from './constants';
import { Amount, Cell, Label, Strip } from './StatStrip.styles';

export type StatTone = 'deposits' | 'gain';

interface StatProps {
  tone: StatTone;
  label: string;
  amountAgorot: number;
  testId: string;
  allowHalf?: boolean;
}

interface StatStripProps {
  principal: number;
  interestGain: number;
  todayInterest: number;
}

function Stat({
  tone,
  label,
  amountAgorot,
  testId,
  allowHalf,
}: StatProps): JSX.Element {
  return (
    <Cell tone={tone}>
      <Label tone={tone}>{label}</Label>
      <Amount>
        <Money
          amountAgorot={amountAgorot}
          testId={testId}
          allowHalf={allowHalf}
        />
      </Amount>
    </Cell>
  );
}

export function StatStrip({
  principal,
  interestGain,
  todayInterest,
}: StatStripProps): JSX.Element {
  const hasTodayInterest = halfShekelAmount(todayInterest) !== null;

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
      {hasTodayInterest && (
        <Stat
          tone="gain"
          label={STAT_STRIP_COPY.todayLabel}
          amountAgorot={todayInterest}
          testId={STAT_STRIP_TEST_IDS.todayInterest}
          allowHalf
        />
      )}
    </Strip>
  );
}
