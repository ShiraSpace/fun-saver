import { COIN_RADIUS, COIN_SQUASH } from '../constants';

export const COIN_PILE_TEST_IDS = {
  coin: 'coin-pile-coin',
} as const;

export const PILE_COIN_SHAPE = {
  edge: { cy: 3.2, rx: COIN_RADIUS, ry: COIN_RADIUS * COIN_SQUASH },
  face: { rx: COIN_RADIUS, ry: COIN_RADIUS * COIN_SQUASH },
  rim: {
    rx: COIN_RADIUS * 0.7,
    ry: COIN_RADIUS * COIN_SQUASH * 0.68,
    fill: 'none',
    strokeWidth: 1.1,
  },
  shine: {
    cx: -COIN_RADIUS * 0.35,
    cy: -COIN_RADIUS * COIN_SQUASH * 0.3,
    rx: COIN_RADIUS * 0.3,
    ry: COIN_RADIUS * COIN_SQUASH * 0.22,
    opacity: 0.7,
  },
} as const;
