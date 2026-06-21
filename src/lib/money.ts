import { AGOROT_PER_SHEKEL } from './constants';

export interface CoinBreakdown {
  show: boolean;
  full: number;
  half: boolean;
}

const HALF_SHEKEL_AGOROT = AGOROT_PER_SHEKEL / 2;

export function agorotToShekels(agorot: number): number {
  return agorot / AGOROT_PER_SHEKEL;
}

export function coinBreakdown(agorot: number): CoinBreakdown {
  const halfShekels = Math.ceil(agorot / HALF_SHEKEL_AGOROT - 0.5);
  const rounded = halfShekels * HALF_SHEKEL_AGOROT;

  if (rounded <= 0) {
    return { show: false, full: 0, half: false };
  }

  return {
    show: true,
    full: Math.floor(rounded / AGOROT_PER_SHEKEL),
    half: rounded % AGOROT_PER_SHEKEL === HALF_SHEKEL_AGOROT,
  };
}
