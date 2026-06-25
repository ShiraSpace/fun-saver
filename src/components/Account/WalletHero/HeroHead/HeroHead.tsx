'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { COLORS } from '@/theme/palette';
import {
  HERO_STYLE,
  WALLET_HERO_COPY,
  WALLET_HERO_TEST_IDS,
} from '../constants';

interface HeroHeadProps {
  name: string;
  monthlyInterestRate: number;
  openedAt: string;
}

const tileGradient = ({ theme }: { theme: Theme }): string =>
  theme.gradients.sunnyTile;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${HERO_STYLE.headGap}px;
  text-align: start;
`;

const IconTile = styled.div`
  flex-shrink: 0;
  width: ${HERO_STYLE.iconTileSize}px;
  height: ${HERO_STYLE.iconTileSize}px;
  border-radius: ${HERO_STYLE.iconTileRadius}px;
  background: ${tileGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${HERO_STYLE.iconFontSize}px;
`;

const Titles = styled.div`
  flex: 1;
`;

const Eyebrow = styled.div`
  font-size: ${HERO_STYLE.eyebrowSize}px;
  font-weight: 600;
  letter-spacing: 0.6px;
  color: ${COLORS.accent};
`;

const NameLine = styled.div`
  font-size: ${HERO_STYLE.nameLineSize}px;
  font-weight: 700;
  margin-top: 2px;
`;

const Meta = styled.div`
  font-size: ${HERO_STYLE.metaSize}px;
  color: ${COLORS.muted};
  margin-top: 2px;
`;

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
