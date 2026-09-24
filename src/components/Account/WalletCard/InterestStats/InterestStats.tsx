'use client';

import { JSX } from 'react';
import { halfShekelAmount } from '@/lib/money';
import { Money } from '@/components/Money';
import { INTEREST_STATS_COPY, INTEREST_STATS_TEST_IDS } from './constants';
import { Amount, Cell, Label, Stats } from './InterestStats.styles';

export type StatTone = 'principal' | 'interest';

interface StatProps {
  tone: StatTone;
  label: string;
  amountAgorot: number;
  testId: string;
  allowHalf?: boolean;
}

interface InterestStatsProps {
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

export function InterestStats({
  principal,
  interestGain,
  todayInterest,
}: InterestStatsProps): JSX.Element {
  const hasTodayInterest = halfShekelAmount(todayInterest) !== null;

  return (
    <Stats data-testid={INTEREST_STATS_TEST_IDS.stats}>
      <Stat
        tone="principal"
        label={INTEREST_STATS_COPY.principalLabel}
        amountAgorot={principal}
        testId={INTEREST_STATS_TEST_IDS.principal}
      />
      <Stat
        tone="interest"
        label={INTEREST_STATS_COPY.interestGainLabel}
        amountAgorot={interestGain}
        testId={INTEREST_STATS_TEST_IDS.interestGain}
      />
      {hasTodayInterest && (
        <Stat
          tone="interest"
          label={INTEREST_STATS_COPY.todayInterestLabel}
          amountAgorot={todayInterest}
          testId={INTEREST_STATS_TEST_IDS.todayInterest}
          allowHalf
        />
      )}
    </Stats>
  );
}
