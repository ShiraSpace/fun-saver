'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { coinBreakdown } from '@/lib/money';
import { COIN_ROW_COPY, COIN_ROW_STYLE, COIN_ROW_TEST_IDS } from './constants';

const Row = styled.div`
  margin-top: ${COIN_ROW_STYLE.marginTop}px;
  padding: ${COIN_ROW_STYLE.paddingY}px ${COIN_ROW_STYLE.paddingX}px;
  border-radius: ${COIN_ROW_STYLE.radius}px;
  background: ${COIN_ROW_STYLE.background};
  border: ${COIN_ROW_STYLE.border};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${COIN_ROW_STYLE.gap}px;
`;

const Label = styled.span`
  font-size: ${COIN_ROW_STYLE.labelSize}px;
  font-weight: 600;
  color: ${COIN_ROW_STYLE.labelColor};
`;

const Coins = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${COIN_ROW_STYLE.coinGap}px;
  direction: ltr;
`;

const Coin = styled.span<{ half?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ half }) =>
    half ? COIN_ROW_STYLE.coinSize / 2 : COIN_ROW_STYLE.coinSize}px;
  height: ${COIN_ROW_STYLE.coinSize}px;
  background: ${COIN_ROW_STYLE.coinGradient};
  border: 1.5px solid ${COIN_ROW_STYLE.coinBorder};
  color: ${COIN_ROW_STYLE.coinGlyphColor};
  font-size: ${COIN_ROW_STYLE.coinGlyphSize}px;
  font-weight: 800;
  overflow: hidden;
  border-radius: ${({ half }) =>
    half
      ? `0 ${COIN_ROW_STYLE.coinSize}px ${COIN_ROW_STYLE.coinSize}px 0`
      : '50%'};
`;

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
