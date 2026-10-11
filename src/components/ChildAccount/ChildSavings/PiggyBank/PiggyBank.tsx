'use client';

import { JSX, useId } from 'react';
import { PIGGY_BANK_COLORS } from '@/theme/piggy-bank-colors';
import { CoinPile } from './CoinPile';
import { PiggyBankFace } from './PiggyBankFace';
import { PiggyBankPaints } from './PiggyBankPaints';
import { paintOf, piggyBankPaintIds } from './piggy-bank-paint-ids';
import { BELLY, PIGGY_BANK_SHAPE, PIGGY_BANK_TEST_IDS, PIGGY_BANK_VIEW_BOX } from './constants';
import { PiggyBankDrawing } from './PiggyBank.styles';

interface PiggyBankProps {
  fill: number;
}

export function PiggyBank({ fill }: PiggyBankProps): JSX.Element {
  const paintIds = piggyBankPaintIds(useId());
  const { shadow, feet, body, bodyShine, earsLift, ear, earShine, earMirror } = PIGGY_BANK_SHAPE;
  const { bellyRim, glassStreak } = PIGGY_BANK_SHAPE;
  const feetShapes = feet.map((foot) => (
    <ellipse key={foot.cx} {...foot} fill={PIGGY_BANK_COLORS.feet} />
  ));

  return (
    <PiggyBankDrawing
      viewBox={PIGGY_BANK_VIEW_BOX}
      aria-hidden="true"
      data-testid={PIGGY_BANK_TEST_IDS.art}
    >
      <PiggyBankPaints paintIds={paintIds} />
      <ellipse {...shadow} fill={PIGGY_BANK_COLORS.shadow} filter={paintOf(paintIds.shadowBlur)} />
      {feetShapes}
      <ellipse {...body} fill={paintOf(paintIds.body)} />
      <ellipse {...bodyShine} fill={PIGGY_BANK_COLORS.shine} filter={paintOf(paintIds.shineBlur)} />
      <g transform={earsLift}>
        <g id={paintIds.leftEar}>
          <path d={ear} fill={paintOf(paintIds.ear)} />
          <path {...earShine} stroke={PIGGY_BANK_COLORS.earShine} />
        </g>
        <use href={`#${paintIds.leftEar}`} transform={earMirror} />
      </g>
      <ellipse {...bellyRim} fill={PIGGY_BANK_COLORS.bellyRim} />
      <ellipse {...BELLY} fill={PIGGY_BANK_COLORS.belly} />
      <CoinPile fill={fill} paintIds={paintIds} />
      <ellipse {...BELLY} fill={paintOf(paintIds.glass)} />
      <path {...glassStreak} stroke={PIGGY_BANK_COLORS.shine} />
      <PiggyBankFace paintIds={paintIds} />
    </PiggyBankDrawing>
  );
}
