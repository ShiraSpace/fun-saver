'use client';

import { JSX } from 'react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { PICTURE_TILES_COPY, PICTURE_TILES_TEST_IDS } from './constants';
import {
  FoundPictures,
  NoPicturesReason,
  PictureTile,
} from './PictureTiles.styles';

interface PictureTilesProps {
  pictures: string[];
  requestState: RequestState;
  query: string;
  chosenPicture: string;
  onChoosePicture: (picture: string) => void;
}

interface PictureSearchResult {
  pictures: string[];
  requestState: RequestState;
  query: string;
}

function whyNoPictures({
  pictures,
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

  return pictures.length === 0 ? PICTURE_TILES_COPY.noMatch(query) : null;
}

export function PictureTiles({
  pictures,
  requestState,
  query,
  chosenPicture,
  onChoosePicture,
}: PictureTilesProps): JSX.Element {
  const noPicturesReason = whyNoPictures({ pictures, requestState, query });
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

  const pictureTiles = pictures.map((picture) => (
    <PictureTile
      key={picture}
      type="button"
      aria-pressed={picture === chosenPicture}
      data-testid={PICTURE_TILES_TEST_IDS.pictureTile}
      onClick={(): void => onChoosePicture(picture)}
    >
      {picture}
    </PictureTile>
  ));

  return (
    <FoundPictures data-testid={PICTURE_TILES_TEST_IDS.foundPictures}>
      {pictureTiles}
    </FoundPictures>
  );
}
