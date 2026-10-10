'use client';

import { JSX } from 'react';
import type { GoalPicture } from '@/lib/goal/types';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { PICTURE_TILES_COPY, PICTURE_TILES_TEST_IDS } from './constants';
import { PictureTile } from './PictureTile';
import { FoundPictures, NoPicturesReason } from './PictureTiles.styles';

interface PictureTilesProps {
  foundEmoji: string[];
  requestState: RequestState;
  query: string;
  chosenPicture: GoalPicture;
  onChoosePicture: (picture: GoalPicture) => void;
}

function whyNoPictures({
  foundEmoji,
  requestState,
  query,
}: Pick<PictureTilesProps, 'foundEmoji' | 'requestState' | 'query'>):
  string | null {
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
      emoji={emoji}
      isChosen={emoji === chosenPicture.emoji}
      onChoosePicture={onChoosePicture}
    />
  ));

  return (
    <FoundPictures data-testid={PICTURE_TILES_TEST_IDS.foundPictures}>
      {pictureTiles}
    </FoundPictures>
  );
}
