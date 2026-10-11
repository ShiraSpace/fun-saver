import { JSX } from 'react';
import { PIGGY_BANK_GRADIENT_STOPS, type GradientStop } from '@/theme/piggy-bank-colors';
import { BELLY, PIGGY_BANK_BLUR, PIGGY_BANK_GRADIENT_SHAPE } from '../constants';
import type { PiggyBankPaintIds } from '../piggy-bank-paint-ids';

interface PiggyBankPaintsProps {
  ids: PiggyBankPaintIds;
}

function stopsOf(stops: readonly GradientStop[]): JSX.Element[] {
  return stops.map((stop) => (
    <stop
      key={stop.offset}
      offset={stop.offset}
      stopColor={stop.color}
      stopOpacity={stop.opacity}
    />
  ));
}

export function PiggyBankPaints({ ids }: PiggyBankPaintsProps): JSX.Element {
  const { coinFace, body, snout, vertical } = PIGGY_BANK_GRADIENT_SHAPE;

  return (
    <defs>
      <radialGradient id={ids.coinFace} {...coinFace}>
        {stopsOf(PIGGY_BANK_GRADIENT_STOPS.coinFace)}
      </radialGradient>
      <radialGradient id={ids.body} {...body}>
        {stopsOf(PIGGY_BANK_GRADIENT_STOPS.body)}
      </radialGradient>
      <linearGradient id={ids.ear} {...vertical}>
        {stopsOf(PIGGY_BANK_GRADIENT_STOPS.ear)}
      </linearGradient>
      <radialGradient id={ids.snout} {...snout}>
        {stopsOf(PIGGY_BANK_GRADIENT_STOPS.snout)}
      </radialGradient>
      <linearGradient id={ids.glass} {...vertical}>
        {stopsOf(PIGGY_BANK_GRADIENT_STOPS.glass)}
      </linearGradient>
      <clipPath id={ids.belly}>
        <ellipse {...BELLY} />
      </clipPath>
      <filter id={ids.shadowBlur}>
        <feGaussianBlur stdDeviation={PIGGY_BANK_BLUR.shadow} />
      </filter>
      <filter id={ids.shineBlur}>
        <feGaussianBlur stdDeviation={PIGGY_BANK_BLUR.shine} />
      </filter>
    </defs>
  );
}
