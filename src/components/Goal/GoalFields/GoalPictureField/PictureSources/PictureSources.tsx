import { JSX } from 'react';
import { GOAL_PICTURE_FIELD_COPY, GOAL_PICTURE_FIELD_TEST_IDS } from '../constants';
import { Soon, Source, Sources } from './PictureSources.styles';

interface PictureSourcesProps {
  onSearch: () => void;
}

export function PictureSources({ onSearch }: PictureSourcesProps): JSX.Element {
  return (
    <Sources>
      <Source type="button" data-testid={GOAL_PICTURE_FIELD_TEST_IDS.search} onClick={onSearch}>
        {GOAL_PICTURE_FIELD_COPY.search}
      </Source>
      <Source type="button" disabled>
        {GOAL_PICTURE_FIELD_COPY.upload} <Soon>{GOAL_PICTURE_FIELD_COPY.soon}</Soon>
      </Source>
      <Source type="button" disabled>
        {GOAL_PICTURE_FIELD_COPY.link} <Soon>{GOAL_PICTURE_FIELD_COPY.soon}</Soon>
      </Source>
    </Sources>
  );
}
