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
      <radialGradient id={paintIds.coinFace.id} {...coinFace}>
        {coinFaceStops}
      </radialGradient>
      <radialGradient id={paintIds.body.id} {...body}>
        {bodyStops}
      </radialGradient>
      <linearGradient id={paintIds.ear.id} {...vertical}>
        {earStops}
      </linearGradient>
      <radialGradient id={paintIds.snout.id} {...snout}>
        {snoutStops}
      </radialGradient>
      <linearGradient id={paintIds.glass.id} {...vertical}>
        {glassStops}
      </linearGradient>
      <clipPath id={paintIds.belly.id}>
        <ellipse {...BELLY} />
      </clipPath>
      <filter id={paintIds.shadowBlur.id}>
        <feGaussianBlur stdDeviation={PIGGY_BANK_BLUR.shadow} />
      </filter>
      <filter id={paintIds.shineBlur.id}>
        <feGaussianBlur stdDeviation={PIGGY_BANK_BLUR.shine} />
      </filter>
    </defs>
  );
}
