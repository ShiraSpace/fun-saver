'use client';

import { JSX } from 'react';
import { nearestHalfShekel } from '@/lib/money';
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
  interestEarned: number;
  interestEarnedToday: number;
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
  interestEarned,
  interestEarnedToday,
}: InterestStatsProps): JSX.Element {
  const hasTodayInterest = nearestHalfShekel(interestEarnedToday) !== null;

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
        label={INTEREST_STATS_COPY.interestEarnedLabel}
        amountAgorot={interestEarned}
        testId={INTEREST_STATS_TEST_IDS.interestEarned}
      />
      {hasTodayInterest && (
        <Stat
          tone="interest"
          label={INTEREST_STATS_COPY.interestEarnedTodayLabel}
          amountAgorot={interestEarnedToday}
          testId={INTEREST_STATS_TEST_IDS.interestEarnedToday}
          allowHalf
        />
      )}
    </Stats>
  );
}
