'use client';

import { useState } from 'react';
import { DEFAULT_GOAL_PICTURE, GOAL_PICTURE_KIND } from '@/lib/goal/constants';
import type { GoalPicture } from '@/lib/goal/types';
import type { RequestState } from '@/lib/request-state';
import { useDebouncedValue } from './use-debounced-value';
import { useMatchingPictures } from './use-matching-pictures';
import { PICTURE_SEARCH_DELAY_MS } from './constants';

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
  chosenPictureText: string;
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
  const [chosenPictureText, setChosenPictureText] = useState(
    (picture ?? DEFAULT_GOAL_PICTURE).emoji
  );
  const searchedQuery = useDebouncedValue(query, PICTURE_SEARCH_DELAY_MS);
  const { pictures, requestState } = useMatchingPictures(searchedQuery);

  return {
    query,
    searchedQuery,
    pictures,
    requestState,
    chosenPictureText,
    editQuery: setQuery,
    choosePicture: setChosenPictureText,
    confirmChoice: (): void =>
      onChange({ kind: GOAL_PICTURE_KIND.emoji, emoji: chosenPictureText }),
  };
}
