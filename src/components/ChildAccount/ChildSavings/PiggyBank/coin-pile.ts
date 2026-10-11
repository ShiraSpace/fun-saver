import { BELLY, COIN_PILE_LAYOUT, COIN_RADIUS, COIN_SQUASH, PIGGY_BANK_FILL } from './constants';

export interface PileSpot {
  x: number;
  y: number;
  tilt: number;
}

export interface PiggyBankFillParams {
  savingsBalance: number;
  fullAt: number;
}

export function piggyBankFill({ savingsBalance, fullAt }: PiggyBankFillParams): number {
  if (fullAt <= 0) {
    return PIGGY_BANK_FILL.full;
  }

  return Math.min(Math.max(savingsBalance / fullAt, PIGGY_BANK_FILL.empty), PIGGY_BANK_FILL.full);
}

function steadyJitter(seed: number): number {
  const { jitterSeed, jitterCentre } = COIN_PILE_LAYOUT;
  const { multiplier, offset, spread } = jitterSeed;
  const wave = Math.sin(seed * multiplier + offset) * spread;

  return wave - Math.floor(wave) - jitterCentre;
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
  const { coinStep, wallGap, rowsPerPattern, oddRow } = COIN_PILE_LAYOUT;
  const fromCentre = (height - BELLY.cy) / BELLY.ry;
  const halfWidth = BELLY.rx * Math.sqrt(Math.max(1 - fromCentre * fromCentre, 0)) - wallGap;
  const staggered = row % rowsPerPattern === oddRow;
  const firstOffset = -halfWidth + (staggered ? coinStep / rowsPerPattern : 0);
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
