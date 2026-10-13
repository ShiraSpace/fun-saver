import { JSX } from 'react';
import { DEFAULT_GOAL_PICTURE } from '@/lib/goal/constants';
import type { GoalPicture } from '@/lib/goal/types';
import { PictureSources } from './PictureSources';
import { GOAL_PICTURE_FIELD_COPY, GOAL_PICTURE_FIELD_TEST_IDS } from './constants';
import { Card, Preview, Section, SectionLabel, Swap } from './GoalPictureField.styles';

interface GoalPictureFieldProps {
  picture: GoalPicture | null;
  onSearch: () => void;
}

export function GoalPictureField({ picture, onSearch }: GoalPictureFieldProps): JSX.Element {
  const shownPicture = picture ?? DEFAULT_GOAL_PICTURE;

  return (
    <Section>
      <SectionLabel>{GOAL_PICTURE_FIELD_COPY.label}</SectionLabel>
      <Card>
        <Preview
          type="button"
          aria-label={GOAL_PICTURE_FIELD_COPY.search}
          data-testid={GOAL_PICTURE_FIELD_TEST_IDS.preview}
          onClick={onSearch}
        >
          {shownPicture.emoji}
          <Swap aria-hidden="true">{GOAL_PICTURE_FIELD_COPY.swap}</Swap>
        </Preview>
        <PictureSources onSearch={onSearch} />
      </Card>
    </Section>
  );
}
