import { Fragment, JSX } from 'react';
import { PIGGY_BANK_COLORS } from '@/theme/piggy-bank-colors';
import { PIGGY_BANK_SHAPE } from '../constants';
import { paintOf, type PiggyBankPaintIds } from '../piggy-bank-paint-ids';

interface PiggyBankFaceProps {
  paintIds: PiggyBankPaintIds;
}

export function PiggyBankFace({ paintIds }: PiggyBankFaceProps): JSX.Element {
  const { eyes, cheeks, snout, nostrils, slot, slotShine } = PIGGY_BANK_SHAPE;
  const eyeShapes = eyes.map(({ eye, glint, sparkle }) => (
    <Fragment key={eye.cx}>
      <ellipse {...eye} fill={PIGGY_BANK_COLORS.eye} />
      <circle {...glint} fill={PIGGY_BANK_COLORS.shine} />
      <circle {...sparkle} fill={PIGGY_BANK_COLORS.shine} />
    </Fragment>
  ));
  const cheekShapes = cheeks.map((cheek) => (
    <ellipse key={cheek.cx} {...cheek} fill={PIGGY_BANK_COLORS.cheek} />
  ));
  const nostrilShapes = nostrils.map((nostril) => (
    <ellipse key={nostril.cx} {...nostril} fill={PIGGY_BANK_COLORS.nostril} />
  ));

  return (
    <g>
      {eyeShapes}
      {cheekShapes}
      <ellipse {...snout} fill={paintOf(paintIds.snout)} />
      {nostrilShapes}
      <rect {...slot} fill={PIGGY_BANK_COLORS.slot} />
      <rect {...slotShine} fill={PIGGY_BANK_COLORS.shine} />
    </g>
  );
}
