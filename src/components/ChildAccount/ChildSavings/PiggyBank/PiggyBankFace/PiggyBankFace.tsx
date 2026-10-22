import { Fragment, JSX } from 'react';
import { PIGGY_BANK_COLORS } from '@/theme/piggy-bank-colors';
import { PIGGY_BANK_SHAPE } from '../constants';
import type { PiggyBankPaintIds } from '../piggy-bank-paint-ids';
import { PIGGY_BANK_FACE_TEST_IDS } from './constants';

interface PiggyBankFaceProps {
  paintIds: PiggyBankPaintIds;
  isGoalReached?: boolean;
}

function openEyeShapes(): JSX.Element[] {
  return PIGGY_BANK_SHAPE.eyes.map(({ eye, glint, sparkle }) => (
    <Fragment key={eye.cx}>
      <ellipse {...eye} fill={PIGGY_BANK_COLORS.eye} data-testid={PIGGY_BANK_FACE_TEST_IDS.eye} />
      <circle {...glint} fill={PIGGY_BANK_COLORS.shine} />
      <circle {...sparkle} fill={PIGGY_BANK_COLORS.shine} />
    </Fragment>
  ));
}

function happyEyeShapes(): JSX.Element[] {
  const { happyEyes, happyEye } = PIGGY_BANK_SHAPE;

  return happyEyes.map((happyEyePath) => (
    <path
      key={happyEyePath}
      d={happyEyePath}
      {...happyEye}
      stroke={PIGGY_BANK_COLORS.eye}
      data-testid={PIGGY_BANK_FACE_TEST_IDS.happyEye}
    />
  ));
}

export function PiggyBankFace({
  paintIds,
  isGoalReached = false,
}: PiggyBankFaceProps): JSX.Element {
  const { cheeks, happyCheekOpacity, snout, nostrils, slot, slotShine } = PIGGY_BANK_SHAPE;
  const eyeShapes = isGoalReached ? happyEyeShapes() : openEyeShapes();
  const cheekShapes = cheeks.map((cheek) => {
    const cheekOpacity = isGoalReached ? happyCheekOpacity : cheek.opacity;

    return (
      <ellipse
        key={cheek.cx}
        {...cheek}
        opacity={cheekOpacity}
        fill={PIGGY_BANK_COLORS.cheek}
        data-testid={PIGGY_BANK_FACE_TEST_IDS.cheek}
      />
    );
  });
  const nostrilShapes = nostrils.map((nostril) => (
    <ellipse key={nostril.cx} {...nostril} fill={PIGGY_BANK_COLORS.nostril} />
  ));

  return (
    <g>
      {eyeShapes}
      {cheekShapes}
      <ellipse {...snout} fill={paintIds.snout.url} data-testid={PIGGY_BANK_FACE_TEST_IDS.snout} />
      {nostrilShapes}
      <rect {...slot} fill={PIGGY_BANK_COLORS.slot} />
      <rect {...slotShine} fill={PIGGY_BANK_COLORS.shine} />
    </g>
  );
}
