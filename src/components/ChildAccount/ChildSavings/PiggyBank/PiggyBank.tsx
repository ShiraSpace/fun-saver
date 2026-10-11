'use client';

import { JSX, useId } from 'react';
import { PIGGY_BANK_COLORS } from '@/theme/piggy-bank-colors';
import { CoinPile } from './CoinPile';
import { PiggyBankFace } from './PiggyBankFace';
import { PiggyBankPaints } from './PiggyBankPaints';
import { paintOf, piggyBankPaintIds } from './piggy-bank-paint-ids';
import { BELLY, PIGGY_BANK_SHAPE, PIGGY_BANK_TEST_IDS, PIGGY_BANK_VIEW_BOX } from './constants';
import { Art } from './PiggyBank.styles';

interface PiggyBankProps {
  fill: number;
}

export function PiggyBank({ fill }: PiggyBankProps): JSX.Element {
  const ids = piggyBankPaintIds(useId());
  const { shadow, feet, body, bodyShine, earsLift, ear, earShine, earMirror } = PIGGY_BANK_SHAPE;

  return (
    <Art viewBox={PIGGY_BANK_VIEW_BOX} aria-hidden="true" data-testid={PIGGY_BANK_TEST_IDS.art}>
      <PiggyBankPaints ids={ids} />
      <ellipse {...shadow} fill={PIGGY_BANK_COLORS.shadow} filter={paintOf(ids.shadowBlur)} />
      {feet.map((foot) => (
        <ellipse key={foot.cx} {...foot} fill={PIGGY_BANK_COLORS.feet} />
      ))}
      <ellipse {...body} fill={paintOf(ids.body)} />
      <ellipse {...bodyShine} fill={PIGGY_BANK_COLORS.shine} filter={paintOf(ids.shineBlur)} />
      <g transform={earsLift}>
        <g id={ids.leftEar}>
          <path d={ear} fill={paintOf(ids.ear)} />
          <path {...earShine} fill="none" stroke={PIGGY_BANK_COLORS.earShine} />
        </g>
        <use href={`#${ids.leftEar}`} transform={earMirror} />
      </g>
      <ellipse {...PIGGY_BANK_SHAPE.bellyRim} fill={PIGGY_BANK_COLORS.bellyRim} />
      <ellipse {...BELLY} fill={PIGGY_BANK_COLORS.belly} />
      <CoinPile fill={fill} ids={ids} />
      <ellipse {...BELLY} fill={paintOf(ids.glass)} />
      <path {...PIGGY_BANK_SHAPE.glassStreak} fill="none" stroke={PIGGY_BANK_COLORS.shine} />
      <PiggyBankFace ids={ids} />
    </Art>
  );
}
