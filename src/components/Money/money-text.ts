import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_TENTH } from './constants';

export function floorToTenthsText(agorot: number): string {
  const isBelowATenth = agorot !== 0 && Math.abs(agorot) < AGOROT_PER_TENTH;

  if (isBelowATenth) {
    return agorotToShekels(agorot).toFixed(2);
  }

  const tenths = Math.trunc(agorot / AGOROT_PER_TENTH);

  return String(agorotToShekels(tenths * AGOROT_PER_TENTH));
}
