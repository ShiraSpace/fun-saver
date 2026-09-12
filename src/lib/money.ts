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

export function agorotToWholeShekels(agorot: number): number {
  return Math.round(agorotToShekels(agorot));
}

export function shekelsToAgorot(shekels: number): number {
  return shekels * AGOROT_PER_SHEKEL;
}

export function halfShekelAmount(agorot: number): number | null {
  const halfShekels = Math.ceil(agorot / HALF_SHEKEL_AGOROT - 0.5);

  if (halfShekels <= 0) {
    return null;
  }

  return agorotToShekels(halfShekels * HALF_SHEKEL_AGOROT);
}

export function coinBreakdown(agorot: number): CoinBreakdown {
  const shekels = halfShekelAmount(agorot);

  if (shekels === null) {
    return { show: false, full: 0, half: false };
  }

  return { show: true, full: Math.floor(shekels), half: shekels % 1 !== 0 };
}
