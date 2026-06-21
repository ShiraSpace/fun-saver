'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { COLORS } from '@/theme/palette';
import { Money } from '../../Money/Money';
import {
  HERO_STYLE,
  WALLET_HERO_COPY,
  WALLET_HERO_TEST_IDS,
} from '../constants';

const Block = styled.div`
  text-align: center;
  margin-top: 18px;
`;

const Label = styled.div`
  font-size: ${HERO_STYLE.amountLabelSize}px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${COLORS.muted};
  margin-bottom: 6px;
`;

const Big = styled.div`
  font-size: ${HERO_STYLE.amountSize}px;
`;

interface HeroAmountProps {
  balance: number;
}

export function HeroAmount({ balance }: HeroAmountProps): JSX.Element {
  return (
    <Block>
      <Label>{WALLET_HERO_COPY.totalLabel}</Label>
      <Big>
        <Money amountAgorot={balance} testId={WALLET_HERO_TEST_IDS.balance} />
      </Big>
    </Block>
  );
}
