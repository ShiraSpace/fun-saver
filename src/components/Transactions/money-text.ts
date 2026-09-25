import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { agorotToShekels, agorotToWholeShekels } from '@/lib/money';
import { AGOROT_SHOWN_BELOW } from './constants';

export function shekelsText(agorot: number, withAgorot: boolean): string {
  return withAgorot
    ? agorotToShekels(agorot).toFixed(2)
    : String(agorotToWholeShekels(agorot));
}

export function needsAgorot(agorot: number): boolean {
  const magnitude = Math.abs(agorot);

  return magnitude < AGOROT_SHOWN_BELOW && magnitude % AGOROT_PER_SHEKEL !== 0;
}
