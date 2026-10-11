import { JSX } from 'react';
import { PIGGY_BANK_COLORS } from '@/theme/piggy-bank-colors';
import { coinTransformOf, coinsInPile } from '../coin-pile';
import type { PiggyBankPaintIds } from '../piggy-bank-paint-ids';
import { COIN_PILE_TEST_IDS, PILE_COIN_SHAPE } from './constants';

interface CoinPileProps {
  piggyBankFill: number;
  paintIds: PiggyBankPaintIds;
}

export function CoinPile({ piggyBankFill, paintIds }: CoinPileProps): JSX.Element {
  const coins = coinsInPile(piggyBankFill).map((spot, index) => {
    const coinTransform = coinTransformOf(spot);

    return (
      <g key={index} data-testid={COIN_PILE_TEST_IDS.coin} transform={coinTransform}>
        <ellipse {...PILE_COIN_SHAPE.edge} fill={PIGGY_BANK_COLORS.coinEdge} />
        <ellipse {...PILE_COIN_SHAPE.face} fill={paintIds.coinFace.url} />
        <ellipse {...PILE_COIN_SHAPE.rim} stroke={PIGGY_BANK_COLORS.coinRim} />
        <ellipse {...PILE_COIN_SHAPE.shine} fill={PIGGY_BANK_COLORS.shine} />
      </g>
    );
  });

  return <g clipPath={paintIds.belly.url}>{coins}</g>;
}
