'use client';

import { useDeferredValue, useState } from 'react';
import { DEFAULT_GOAL_PICTURE, GOAL_PICTURE_KIND } from '@/lib/goal/constants';
import type { GoalPicture } from '@/lib/goal/types';
import type { RequestState } from '@/lib/request-state';
import { useMatchingPictures } from './use-matching-pictures';

interface GoalPictureSearchOptions {
  goalName: string;
  picture: GoalPicture | null;
  onChange: (picture: GoalPicture) => void;
}

interface GoalPictureSearchState {
  query: string;
  searchedQuery: string;
  pictures: string[];
  requestState: RequestState;
  chosenPicture: string;
  editQuery: (query: string) => void;
  choosePicture: (picture: string) => void;
  confirmChoice: () => void;
}

export function useGoalPictureSearch({
  goalName,
  picture,
  onChange,
}: GoalPictureSearchOptions): GoalPictureSearchState {
  const [query, setQuery] = useState(goalName);
  const [chosenPicture, setChosenPicture] = useState(
    (picture ?? DEFAULT_GOAL_PICTURE).emoji
  );
  const searchedQuery = useDeferredValue(query);
  const { pictures, requestState } = useMatchingPictures(searchedQuery);

  return {
    query,
    searchedQuery,
    pictures,
    requestState,
    chosenPicture,
    editQuery: setQuery,
    choosePicture: setChosenPicture,
    confirmChoice: (): void =>
      onChange({ kind: GOAL_PICTURE_KIND.emoji, emoji: chosenPicture }),
  };
}
