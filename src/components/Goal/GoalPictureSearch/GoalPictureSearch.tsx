'use client';

import { JSX, useId } from 'react';
import { useEscapeKey } from '@/hooks/use-escape-key';
import type { GoalPicture } from '@/lib/goal/types';
import { ChooseButton } from './ChooseButton';
import { PictureTiles } from './PictureTiles';
import { QueryField } from './QueryField';
import { SheetHeading } from './SheetHeading';
import { useGoalPictureSearch } from './use-goal-picture-search';
import { GOAL_PICTURE_SEARCH_TEST_IDS } from './constants';
import { Scrim, Sheet } from './GoalPictureSearch.styles';

export interface GoalPictureSearchProps {
  goalName: string;
  picture: GoalPicture | null;
  onChange: (picture: GoalPicture) => void;
  onClose: () => void;
}

export function GoalPictureSearch({
  goalName,
  picture,
  onChange,
  onClose,
}: GoalPictureSearchProps): JSX.Element {
  const titleId = useId();
  const search = useGoalPictureSearch({ goalName, picture, onChange });

  useEscapeKey({
    isListening: true,
    onEscape: onClose,
    takesPrecedence: true,
  });

  return (
    <>
      <Scrim
        data-testid={GOAL_PICTURE_SEARCH_TEST_IDS.scrim}
        onClick={onClose}
      />
      <Sheet
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid={GOAL_PICTURE_SEARCH_TEST_IDS.sheet}
      >
        <SheetHeading titleId={titleId} onClose={onClose} />
        <QueryField query={search.query} onChange={search.editQuery} />
        <PictureTiles
          pictures={search.pictures}
          requestState={search.requestState}
          query={search.searchedQuery}
          chosenPictureText={search.chosenPictureText}
          onChoosePicture={search.choosePicture}
        />
        <ChooseButton onConfirm={search.confirmChoice} />
      </Sheet>
    </>
  );
}
