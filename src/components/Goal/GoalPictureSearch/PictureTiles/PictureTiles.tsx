'use client';

import { JSX } from 'react';
import { GOAL_PICTURE_KIND } from '@/lib/goal/constants';
import type { GoalPicture } from '@/lib/goal/types';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { PICTURE_TILES_COPY, PICTURE_TILES_TEST_IDS } from './constants';
import {
  FoundPictures,
  NoPicturesReason,
  PictureTile,
} from './PictureTiles.styles';

interface PictureTilesProps {
  foundEmoji: string[];
  requestState: RequestState;
  query: string;
  chosenPicture: GoalPicture;
  onChoosePicture: (picture: GoalPicture) => void;
}

interface PictureSearchResult {
  foundEmoji: string[];
  requestState: RequestState;
  query: string;
}

function whyNoPictures({
  foundEmoji,
  requestState,
  query,
}: PictureSearchResult): string | null {
  if (requestState === REQUEST_STATE.pending) {
    return PICTURE_TILES_COPY.loading;
  }

  if (requestState === REQUEST_STATE.failed) {
    return PICTURE_TILES_COPY.failedToLoad;
  }

  if (!query.trim()) {
    return PICTURE_TILES_COPY.nothingTyped;
  }

  return foundEmoji.length === 0 ? PICTURE_TILES_COPY.noMatch(query) : null;
}

export function PictureTiles({
  foundEmoji,
  requestState,
  query,
  chosenPicture,
  onChoosePicture,
}: PictureTilesProps): JSX.Element {
  const noPicturesReason = whyNoPictures({ foundEmoji, requestState, query });
  const failedToLoad = requestState === REQUEST_STATE.failed;

  if (noPicturesReason) {
    return (
      <NoPicturesReason
        role="status"
        failedToLoad={failedToLoad}
        data-testid={PICTURE_TILES_TEST_IDS.noPicturesReason}
      >
        {noPicturesReason}
      </NoPicturesReason>
    );
  }

  const pictureTiles = foundEmoji.map((emoji) => (
    <PictureTile
      key={emoji}
      type="button"
      aria-pressed={emoji === chosenPicture.emoji}
      data-testid={PICTURE_TILES_TEST_IDS.pictureTile}
      onClick={(): void =>
        onChoosePicture({ kind: GOAL_PICTURE_KIND.emoji, emoji })
      }
    >
      {emoji}
    </PictureTile>
  ));

  return (
    <FoundPictures data-testid={PICTURE_TILES_TEST_IDS.foundPictures}>
      {pictureTiles}
    </FoundPictures>
  );
}
