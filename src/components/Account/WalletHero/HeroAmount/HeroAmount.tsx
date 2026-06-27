'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { Money } from '../../Money/Money';
import { WALLET_HERO_COPY, WALLET_HERO_TEST_IDS } from '../constants';

interface HeroAmountProps {
  balance: number;
}

const Block = styled.div`
  text-align: center;
  margin-top: 8px;
`;

const Label = styled.div`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${({ theme }): string => theme.colors.textMuted};
  margin-bottom: 3px;
`;

const Big = styled.div`
  font-size: ${({ theme }): number => theme.typography.display}px;
`;

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
