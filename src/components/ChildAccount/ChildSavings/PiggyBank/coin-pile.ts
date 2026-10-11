import { BELLY, COIN_PILE_LAYOUT, COIN_RADIUS, COIN_SQUASH } from './constants';

export interface PileSpot {
  x: number;
  y: number;
  tilt: number;
}

export interface PiggyBankFillParams {
  savingsBalance: number;
  fullAt: number;
}

const EMPTY = 0;
const FULL = 1;
const JITTER_CENTRE = 0.5;
const ODD_ROW = 1;

export function piggyBankFill({ savingsBalance, fullAt }: PiggyBankFillParams): number {
  if (fullAt <= 0) {
    return FULL;
  }

  return Math.min(Math.max(savingsBalance / fullAt, EMPTY), FULL);
}

function steadyJitter(seed: number): number {
  const { multiplier, offset, spread } = COIN_PILE_LAYOUT.jitterSeed;
  const wave = Math.sin(seed * multiplier + offset) * spread;

  return wave - Math.floor(wave) - JITTER_CENTRE;
}

function rowHeights(): number[] {
  const halfCoin = COIN_RADIUS * COIN_SQUASH;
  const floor = BELLY.cy + BELLY.ry - halfCoin - COIN_PILE_LAYOUT.floorGap;
  const ceiling = BELLY.cy - BELLY.ry + halfCoin;
  const heights: number[] = [];

  for (let height = floor; height > ceiling; height -= COIN_PILE_LAYOUT.rowStep) {
    heights.push(height);
  }

  return heights;
}

function rowOffsets(height: number, row: number): number[] {
  const { coinStep, wallGap } = COIN_PILE_LAYOUT;
  const fromCentre = (height - BELLY.cy) / BELLY.ry;
  const halfWidth = BELLY.rx * Math.sqrt(Math.max(1 - fromCentre * fromCentre, 0)) - wallGap;
  const firstOffset = -halfWidth + (row % 2 === ODD_ROW ? coinStep / 2 : 0);
  const offsets: number[] = [];

  for (let offset = firstOffset; offset <= halfWidth; offset += coinStep) {
    offsets.push(offset);
  }

  return offsets.sort((left, right) => Math.abs(left) - Math.abs(right));
}

function coinPileSpots(): PileSpot[] {
  const { jitterX, jitterY, jitterTilt, jitterChannel } = COIN_PILE_LAYOUT;
  const places = rowHeights().flatMap((height, row) =>
    rowOffsets(height, row).map((offset) => ({ x: BELLY.cx + offset, y: height }))
  );

  return places.map((place, index) => ({
    x: place.x + steadyJitter(index) * jitterX,
    y: place.y + steadyJitter(index + jitterChannel.y) * jitterY,
    tilt: steadyJitter(index + jitterChannel.tilt) * jitterTilt,
  }));
}

export const COIN_PILE_SPOTS = coinPileSpots();

export function coinsInPile(fill: number): PileSpot[] {
  return COIN_PILE_SPOTS.slice(0, Math.round(COIN_PILE_SPOTS.length * fill));
}
