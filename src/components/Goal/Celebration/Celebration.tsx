'use client';

import { JSX } from 'react';
import {
  CELEBRATION_COLORS,
  CELEBRATION_PIECES,
  CELEBRATION_TEST_IDS,
} from './constants';
import { Falling, Piece } from './Celebration.styles';
import { useMotionIsReduced } from './use-motion-is-reduced';

export function Celebration(): JSX.Element | null {
  const motionIsReduced = useMotionIsReduced();

  if (motionIsReduced) {
    return null;
  }

  const pieces = CELEBRATION_PIECES.map((piece, index) => (
    <Piece
      key={index}
      data-testid={CELEBRATION_TEST_IDS.piece}
      piece={piece}
      colorName={CELEBRATION_COLORS[index % CELEBRATION_COLORS.length]}
    />
  ));

  return (
    <Falling aria-hidden data-testid={CELEBRATION_TEST_IDS.celebration}>
      {pieces}
    </Falling>
  );
}
