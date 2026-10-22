import { PIGGY_BANK_GRADIENT_STOPS } from '@/theme/piggy-bank-colors';

export const coinFace = `radial-gradient(circle at 35% 30%, ${PIGGY_BANK_GRADIENT_STOPS.coinFace
  .map(({ offset, color }) => `${color} ${offset * 100}%`)
  .join(', ')})`;
