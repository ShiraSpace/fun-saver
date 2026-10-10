'use client';

import { JSX } from 'react';
import { GOAL_PICTURE_KIND } from '@/lib/goal/constants';
import type { GoalPicture } from '@/lib/goal/types';
import { PICTURE_TILE_TEST_IDS } from './constants';
import { PictureTileButton } from './PictureTile.styles';

interface PictureTileProps {
  emoji: string;
  isChosen: boolean;
  onChoosePicture: (picture: GoalPicture) => void;
}

export function PictureTile({
  emoji,
  isChosen,
  onChoosePicture,
}: PictureTileProps): JSX.Element {
  const choosePicture = (): void =>
    onChoosePicture({ kind: GOAL_PICTURE_KIND.emoji, emoji });

  return (
    <PictureTileButton
      type="button"
      aria-pressed={isChosen}
      data-testid={PICTURE_TILE_TEST_IDS.pictureTile}
      onClick={choosePicture}
    >
      {emoji}
    </PictureTileButton>
  );
}
