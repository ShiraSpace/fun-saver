'use client';

import { JSX } from 'react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { PICTURE_TILES_COPY, PICTURE_TILES_TEST_IDS } from './constants';
import { Grid, StateLine, Tile } from './PictureTiles.styles';

interface PictureTilesProps {
  pictures: string[];
  requestState: RequestState;
  query: string;
  chosenEmoji: string;
  onChoose: (emoji: string) => void;
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
  chosenEmoji,
  onChoose,
}: PictureTilesProps): JSX.Element {
  const line = stateLine(pictures, requestState, query);

  if (line) {
    return (
      <StateLine
        role="status"
        isAlert={requestState === REQUEST_STATE.failed}
        data-testid={PICTURE_TILES_TEST_IDS.stateLine}
      >
        {line}
      </StateLine>
    );
  }

  const tiles = pictures.map((emoji) => (
    <Tile
      key={emoji}
      type="button"
      aria-pressed={emoji === chosenEmoji}
      data-testid={PICTURE_TILES_TEST_IDS.tile}
      onClick={(): void => onChoose(emoji)}
    >
      {emoji}
    </Tile>
  ));

  return <Grid data-testid={PICTURE_TILES_TEST_IDS.grid}>{tiles}</Grid>;
}
