'use client';

import { useDeferredValue, useState } from 'react';
import { DEFAULT_GOAL_PICTURE } from '@/lib/goal/constants';
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
  foundEmoji: string[];
  requestState: RequestState;
  chosenPicture: GoalPicture;
  editQuery: (query: string) => void;
  choosePicture: (picture: GoalPicture) => void;
  confirmChoice: () => void;
}

export function useGoalPictureSearch({
  goalName,
  picture,
  onChange,
}: GoalPictureSearchOptions): GoalPictureSearchState {
  const [query, setQuery] = useState(goalName);
  const [chosenPicture, setChosenPicture] = useState<GoalPicture>(
    picture ?? DEFAULT_GOAL_PICTURE
  );
  const searchedQuery = useDeferredValue(query);
  const { foundEmoji, requestState } = useMatchingPictures(searchedQuery);

  return {
    query,
    searchedQuery,
    foundEmoji,
    requestState,
    chosenPicture,
    editQuery: setQuery,
    choosePicture: setChosenPicture,
    confirmChoice: (): void => onChange(chosenPicture),
  };
}
