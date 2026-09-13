'use client';

import { JSX } from 'react';
import { WALLET_HERO_COPY, WALLET_HERO_TEST_IDS } from '../constants';
import {
  Head,
  IconTile,
  Titles,
  Eyebrow,
  NameLine,
  Meta,
} from './HeroHead.styles';

interface HeroHeadProps {
  name: string;
  monthlyInterestRate: number;
  openedAt: string;
}

export function HeroHead({
  name,
  monthlyInterestRate,
  openedAt,
}: HeroHeadProps): JSX.Element {
  return (
    <Head>
      <IconTile data-testid={WALLET_HERO_TEST_IDS.icon}>
        {WALLET_HERO_COPY.icon}
      </IconTile>
      <Titles>
        <Eyebrow data-testid={WALLET_HERO_TEST_IDS.eyebrow}>
          {WALLET_HERO_COPY.eyebrow(name)}
        </Eyebrow>
        <NameLine data-testid={WALLET_HERO_TEST_IDS.interestRate}>
          {WALLET_HERO_COPY.interestRate(monthlyInterestRate)}
        </NameLine>
        <Meta data-testid={WALLET_HERO_TEST_IDS.activeSince}>
          {WALLET_HERO_COPY.activeSince(openedAt)}
        </Meta>
      </Titles>
    </Head>
  );
}
