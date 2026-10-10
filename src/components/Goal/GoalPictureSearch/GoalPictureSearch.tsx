'use client';

import { JSX, useId } from 'react';
import type { GoalPicture } from '@/lib/goal/types';
import { ChooseButton } from './ChooseButton';
import { PictureTiles } from './PictureTiles';
import { QueryField } from './QueryField';
import { SheetHeading } from './SheetHeading';
import { useGoalPictureSearch } from './use-goal-picture-search';
import { useModalSheet } from './use-modal-sheet';
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
  const sheetRef = useModalSheet(onClose);

  return (
    <>
      <Scrim
        data-testid={GOAL_PICTURE_SEARCH_TEST_IDS.scrim}
        onClick={onClose}
      />
      <Sheet
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid={GOAL_PICTURE_SEARCH_TEST_IDS.sheet}
      >
        <SheetHeading titleId={titleId} onClose={onClose} />
        <QueryField query={search.query} onChange={search.editQuery} />
        <PictureTiles
          foundEmoji={search.foundEmoji}
          requestState={search.requestState}
          query={search.searchedQuery}
          chosenPicture={search.chosenPicture}
          onChoosePicture={search.choosePicture}
        />
        <ChooseButton onChoose={search.confirmChoice} />
      </Sheet>
    </>
  );
}
