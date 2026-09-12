'use client';

import { JSX } from 'react';
import { Money } from '@/components/Money';
import { WALLET_HERO_COPY, WALLET_HERO_TEST_IDS } from '../constants';
import {
  Row,
  Cell,
  Label,
  Amount,
  type CellTone,
} from './HeroBreakdown.styles';

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
