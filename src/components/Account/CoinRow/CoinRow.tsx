'use client';

import { JSX } from 'react';
import { coinBreakdown } from '@/lib/money';
import { COIN_ROW_COPY, COIN_ROW_TEST_IDS } from './constants';
import { Row, Label, Coins, Coin } from './CoinRow.styles';

interface CoinRowProps {
  todayInterest: number;
}

export function CoinRow({ todayInterest }: CoinRowProps): JSX.Element | null {
  const { show, full, half } = coinBreakdown(todayInterest);

  if (!show) {
    return null;
  }

  const coins = Array.from({ length: full }, (_, index) => (
    <Coin key={`full-${index}`} data-testid={COIN_ROW_TEST_IDS.fullCoin}>
      {COIN_ROW_COPY.currency}
    </Coin>
  ));

  return (
    <Row data-testid={COIN_ROW_TEST_IDS.row}>
      <Label data-testid={COIN_ROW_TEST_IDS.label}>{COIN_ROW_COPY.label}</Label>
      <Coins>
        {coins}
        {half && <Coin half data-testid={COIN_ROW_TEST_IDS.halfCoin} />}
      </Coins>
    </Row>
  );
}
