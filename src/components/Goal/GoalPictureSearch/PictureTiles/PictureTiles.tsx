'use client';

import { JSX } from 'react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { PICTURE_TILES_COPY, PICTURE_TILES_TEST_IDS } from './constants';
import { Grid, StateLine, Tile } from './PictureTiles.styles';

interface PictureTilesProps {
  pictures: string[];
  requestState: RequestState;
  query: string;
  chosenPicture: string;
  onChoosePicture: (picture: string) => void;
}

function stateLine(
  pictures: string[],
  requestState: RequestState,
  query: string
): string | null {
  if (requestState === REQUEST_STATE.pending) {
    return PICTURE_TILES_COPY.loading;
  }
  if (requestState === REQUEST_STATE.failed) {
    return PICTURE_TILES_COPY.failed;
  }
  if (!query.trim()) {
    return PICTURE_TILES_COPY.hint;
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
  const line = stateLine(pictures, requestState, query);
  const isFailed = requestState === REQUEST_STATE.failed;

  if (line) {
    return (
      <StateLine
        role="status"
        isAlert={isFailed}
        data-testid={PICTURE_TILES_TEST_IDS.stateLine}
      >
        {line}
      </StateLine>
    );
  }

  const tiles = pictures.map((picture) => (
    <Tile
      key={picture}
      type="button"
      aria-pressed={picture === chosenPicture}
      data-testid={PICTURE_TILES_TEST_IDS.tile}
      onClick={(): void => onChoosePicture(picture)}
    >
      {picture}
    </Tile>
  ));

  return <Grid data-testid={PICTURE_TILES_TEST_IDS.grid}>{tiles}</Grid>;
}
