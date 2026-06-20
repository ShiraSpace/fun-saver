import { JSX } from 'react';
import { agorotToShekels } from '@/lib/money';
import { MONEY_COPY } from './constants';

interface MoneyProps {
  amountAgorot: number;
  testId: string;
}

export function Money({ amountAgorot, testId }: MoneyProps): JSX.Element {
  return (
    <span data-testid={testId}>
      <span>{MONEY_COPY.currency}</span>
      <span>{agorotToShekels(amountAgorot)}</span>
    </span>
  );
}
