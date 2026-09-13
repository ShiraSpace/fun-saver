'use client';

import { JSX } from 'react';
import { Money } from '@/components/Money';
import { TOTAL_CHIP_COPY, TOTAL_CHIP_TEST_IDS } from './constants';
import { Chip, Label } from './TotalChip.styles';

interface TotalChipProps {
  totalBalance: number;
}

export function TotalChip({ totalBalance }: TotalChipProps): JSX.Element {
  return (
    <Chip data-testid={TOTAL_CHIP_TEST_IDS.chip}>
      <Label>{TOTAL_CHIP_COPY.label}</Label>
      <Money amountAgorot={totalBalance} testId={TOTAL_CHIP_TEST_IDS.amount} />
    </Chip>
  );
}
