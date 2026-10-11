import { JSX } from 'react';
import { PIGGY_BANK_COLORS } from '@/theme/piggy-bank-colors';
import { coinsInPile } from '../coin-pile';
import { paintOf, type PiggyBankPaintIds } from '../piggy-bank-paint-ids';
import { COIN_PILE_TEST_IDS, PILE_COIN_SHAPE } from './constants';

interface CoinPileProps {
  fill: number;
  ids: PiggyBankPaintIds;
}

export function CoinPile({ fill, ids }: CoinPileProps): JSX.Element {
  const coins = coinsInPile(fill).map((spot) => (
    <g
      key={`${spot.x}:${spot.y}`}
      data-testid={COIN_PILE_TEST_IDS.coin}
      transform={`translate(${spot.x} ${spot.y}) rotate(${spot.tilt})`}
    >
      <ellipse {...PILE_COIN_SHAPE.edge} fill={PIGGY_BANK_COLORS.coinEdge} />
      <ellipse {...PILE_COIN_SHAPE.face} fill={paintOf(ids.coinFace)} />
      <ellipse {...PILE_COIN_SHAPE.rim} stroke={PIGGY_BANK_COLORS.coinRim} />
      <ellipse {...PILE_COIN_SHAPE.shine} fill={PIGGY_BANK_COLORS.shine} />
    </g>
  ));

  return <g clipPath={paintOf(ids.belly)}>{coins}</g>;
}
