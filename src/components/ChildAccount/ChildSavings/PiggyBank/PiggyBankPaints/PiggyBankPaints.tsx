import { JSX } from 'react';
import { PIGGY_BANK_GRADIENT_STOPS, type GradientStop } from '@/theme/piggy-bank-colors';
import { BELLY, PIGGY_BANK_BLUR, PIGGY_BANK_GRADIENT_SHAPE } from '../constants';
import type { PiggyBankPaintIds } from '../piggy-bank-paint-ids';

interface PiggyBankPaintsProps {
  paintIds: PiggyBankPaintIds;
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

export function PiggyBankPaints({ paintIds }: PiggyBankPaintsProps): JSX.Element {
  const { coinFace, body, snout, vertical } = PIGGY_BANK_GRADIENT_SHAPE;
  const coinFaceStops = stopsOf(PIGGY_BANK_GRADIENT_STOPS.coinFace);
  const bodyStops = stopsOf(PIGGY_BANK_GRADIENT_STOPS.body);
  const earStops = stopsOf(PIGGY_BANK_GRADIENT_STOPS.ear);
  const snoutStops = stopsOf(PIGGY_BANK_GRADIENT_STOPS.snout);
  const glassStops = stopsOf(PIGGY_BANK_GRADIENT_STOPS.glass);

  return (
    <defs>
      <radialGradient id={paintIds.coinFace} {...coinFace}>
        {coinFaceStops}
      </radialGradient>
      <radialGradient id={paintIds.body} {...body}>
        {bodyStops}
      </radialGradient>
      <linearGradient id={paintIds.ear} {...vertical}>
        {earStops}
      </linearGradient>
      <radialGradient id={paintIds.snout} {...snout}>
        {snoutStops}
      </radialGradient>
      <linearGradient id={paintIds.glass} {...vertical}>
        {glassStops}
      </linearGradient>
      <clipPath id={paintIds.belly}>
        <ellipse {...BELLY} />
      </clipPath>
      <filter id={paintIds.shadowBlur}>
        <feGaussianBlur stdDeviation={PIGGY_BANK_BLUR.shadow} />
      </filter>
      <filter id={paintIds.shineBlur}>
        <feGaussianBlur stdDeviation={PIGGY_BANK_BLUR.shine} />
      </filter>
    </defs>
  );
}
