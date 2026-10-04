'use client';

import { ChangeEvent, JSX, useId } from 'react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useEscapeKey } from '@/components/Menu/use-escape-key';
import type { GoalPicture } from '@/lib/goal/types';
import { PictureTiles } from './PictureTiles';
import { useGoalPictureSearch } from './use-goal-picture-search';
import {
  GOAL_PICTURE_SEARCH_COPY,
  GOAL_PICTURE_SEARCH_TEST_IDS,
} from './constants';
import {
  CloseButton,
  Scrim,
  SearchBox,
  Sheet,
  SheetTitle,
  TitleRow,
} from './GoalPictureSearch.styles';

export interface GoalPictureSearchProps {
  goalName: string;
  picture: GoalPicture | null;
  onChange: (picture: GoalPicture) => void;
  onClose: () => void;
}

interface SheetHeadingProps {
  titleId: string;
  onClose: () => void;
}

function SheetHeading({ titleId, onClose }: SheetHeadingProps): JSX.Element {
  return (
    <TitleRow>
      <SheetTitle id={titleId} data-testid={GOAL_PICTURE_SEARCH_TEST_IDS.title}>
        {GOAL_PICTURE_SEARCH_COPY.title}
      </SheetTitle>
      <CloseButton
        type="button"
        aria-label={GOAL_PICTURE_SEARCH_COPY.closeLabel}
        data-testid={GOAL_PICTURE_SEARCH_TEST_IDS.close}
        onClick={onClose}
      >
        {GOAL_PICTURE_SEARCH_COPY.close}
      </CloseButton>
    </TitleRow>
  );
}

interface QueryFieldProps {
  query: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function QueryField({ query, onChange }: QueryFieldProps): JSX.Element {
  return (
    <SearchBox
      type="search"
      enterKeyHint="search"
      aria-label={GOAL_PICTURE_SEARCH_COPY.queryLabel}
      data-testid={GOAL_PICTURE_SEARCH_TEST_IDS.query}
      value={query}
      onChange={onChange}
    />
  );
}

function ChooseButton({ onChoose }: { onChoose: () => void }): JSX.Element {
  return (
    <PrimaryButton
      type="button"
      data-testid={GOAL_PICTURE_SEARCH_TEST_IDS.choose}
      onClick={onChoose}
    >
      {GOAL_PICTURE_SEARCH_COPY.choose}
    </PrimaryButton>
  );
}

export function GoalPictureSearch({
  goalName,
  picture,
  onChange,
  onClose,
}: GoalPictureSearchProps): JSX.Element {
  const titleId = useId();
  const search = useGoalPictureSearch({ goalName, picture, onChange });

  useEscapeKey({ isListening: true, onEscape: onClose });

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
          chosenEmoji={search.chosenEmoji}
          onChoose={search.chooseEmoji}
        />
        <ChooseButton onChoose={search.confirmChoice} />
      </Sheet>
    </>
  );
}
