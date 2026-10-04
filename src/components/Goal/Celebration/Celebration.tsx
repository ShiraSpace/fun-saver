'use client';

import { JSX } from 'react';
import {
  CELEBRATION_COLORS,
  CELEBRATION_PIECES,
  CELEBRATION_TEST_IDS,
} from './constants';
import { Falling, Piece } from './Celebration.styles';

export function Celebration(): JSX.Element {
  const pieces = CELEBRATION_PIECES.map((piece, index) => {
    const colorName = CELEBRATION_COLORS[index % CELEBRATION_COLORS.length];

    return (
      <Piece
        key={index}
        data-testid={CELEBRATION_TEST_IDS.piece}
        piece={piece}
        colorName={colorName}
      />
    );
  });

  return (
    <Falling aria-hidden data-testid={CELEBRATION_TEST_IDS.celebration}>
      {pieces}
    </Falling>
  );
}
