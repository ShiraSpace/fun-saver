'use client';

import { JSX, Ref, useId } from 'react';
import { PIGGY_BANK_COLORS } from '@/theme/piggy-bank-colors';
import { CoinPile } from './CoinPile';
import { PiggyBankFace } from './PiggyBankFace';
import { PiggyBankPaints } from './PiggyBankPaints';
import { piggyBankPaintIds } from './piggy-bank-paint-ids';
import { BELLY, PIGGY_BANK_SHAPE, PIGGY_BANK_TEST_IDS, PIGGY_BANK_VIEW_BOX } from './constants';
import { PiggyBankBody, PiggyBankDrawing } from './PiggyBank.styles';

interface PiggyBankProps {
  piggyBankFill: number;
  isGoalReached?: boolean;
  ref?: Ref<SVGSVGElement>;
  onClick?: () => void;
}

function piggyBankFeet(): JSX.Element[] {
  return PIGGY_BANK_SHAPE.feet.map((foot) => (
    <ellipse key={foot.cx} {...foot} fill={PIGGY_BANK_COLORS.feet} />
  ));
}

export function PiggyBank({
  piggyBankFill,
  isGoalReached = false,
  ref,
  onClick,
}: PiggyBankProps): JSX.Element {
  const paintIds = piggyBankPaintIds(useId());
  const { shadow, body, bodyShine, earsLift, ear, earShine, earMirror } = PIGGY_BANK_SHAPE;
  const { bellyRim, glassStreak } = PIGGY_BANK_SHAPE;

  return (
    <PiggyBankDrawing
      ref={ref}
      onClick={onClick}
      viewBox={PIGGY_BANK_VIEW_BOX}
      aria-hidden="true"
      data-testid={PIGGY_BANK_TEST_IDS.art}
    >
      <PiggyBankPaints paintIds={paintIds} />
      <ellipse {...shadow} fill={PIGGY_BANK_COLORS.shadow} filter={paintIds.shadowBlur.url} />
      <PiggyBankBody isGoalReached={isGoalReached} data-testid={PIGGY_BANK_TEST_IDS.body}>
        {piggyBankFeet()}
        <ellipse {...body} fill={paintIds.body.url} />
        <ellipse {...bodyShine} fill={PIGGY_BANK_COLORS.shine} filter={paintIds.shineBlur.url} />
        <g transform={earsLift}>
          <g id={paintIds.leftEar.id}>
            <path d={ear} fill={paintIds.ear.url} />
            <path {...earShine} stroke={PIGGY_BANK_COLORS.earShine} />
          </g>
          <use href={paintIds.leftEar.href} transform={earMirror} />
        </g>
        <ellipse {...bellyRim} fill={PIGGY_BANK_COLORS.bellyRim} />
        <ellipse {...BELLY} fill={PIGGY_BANK_COLORS.belly} />
        <CoinPile piggyBankFill={piggyBankFill} paintIds={paintIds} />
        <ellipse {...BELLY} fill={paintIds.glass.url} />
        <path {...glassStreak} stroke={PIGGY_BANK_COLORS.shine} />
        <PiggyBankFace paintIds={paintIds} isGoalReached={isGoalReached} />
      </PiggyBankBody>
    </PiggyBankDrawing>
  );
}
