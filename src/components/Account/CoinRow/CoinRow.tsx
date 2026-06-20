import { JSX } from 'react';
import { coinBreakdown } from '@/lib/money';
import { COIN_ROW_COPY, COIN_ROW_TEST_IDS } from './constants';

interface CoinRowProps {
  todayInterest: number;
}

export function CoinRow({ todayInterest }: CoinRowProps): JSX.Element | null {
  const { show, full, half } = coinBreakdown(todayInterest);
  if (!show) {
    return null;
  }
  return (
    <div data-testid={COIN_ROW_TEST_IDS.row}>
      <span data-testid={COIN_ROW_TEST_IDS.label}>{COIN_ROW_COPY.label}</span>
      {Array.from({ length: full }, (_, index) => (
        <span key={`full-${index}`} data-testid={COIN_ROW_TEST_IDS.fullCoin} />
      ))}
      {half && <span data-testid={COIN_ROW_TEST_IDS.halfCoin} />}
    </div>
  );
}
