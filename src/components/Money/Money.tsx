'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { agorotToWholeShekels, halfShekelAmount } from '@/lib/money';
import { MONEY_COPY, MONEY_STYLE } from './constants';

const Amount = styled.span`
  display: inline-flex;
  align-items: flex-end;
  line-height: 1;
  font-weight: 700;
`;

const Currency = styled.span`
  font-size: ${MONEY_STYLE.currencyScale}em;
  opacity: ${MONEY_STYLE.currencyOpacity};
  margin-inline-end: ${MONEY_STYLE.currencyGap}px;
`;

const Number = styled.span`
  font-variant-numeric: tabular-nums;
`;

interface MoneyProps {
  amountAgorot: number;
  testId: string;
  allowHalf?: boolean;
}

export function Money({
  amountAgorot,
  testId,
  allowHalf = false,
}: MoneyProps): JSX.Element {
  const shekels = allowHalf
    ? (halfShekelAmount(amountAgorot) ?? 0)
    : agorotToWholeShekels(amountAgorot);

  return (
    <Amount dir="ltr" data-testid={testId}>
      <Currency>{MONEY_COPY.currency}</Currency>
      <Number>{shekels}</Number>
    </Amount>
  );
}
