'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  indexPictureWords,
  matchingPictures,
} from '@/lib/goal/picture-search/picture-search';
import type { PicturesByTerm } from '@/lib/goal/picture-search/types';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';

interface MatchingPictures {
  pictures: string[];
  requestState: RequestState;
}

export function useMatchingPictures(query: string): MatchingPictures {
  const [picturesByTerm, setPicturesByTerm] = useState<PicturesByTerm>();
  const [requestState, setRequestState] = useState<RequestState>(
    REQUEST_STATE.pending
  );

  useEffect(() => {
    void import('@/lib/goal/picture-search/picture-words.he.json')
      .then(({ default: pictureWords }) => {
        setPicturesByTerm(indexPictureWords(pictureWords));
        setRequestState(REQUEST_STATE.idle);
      })
      .catch(() => setRequestState(REQUEST_STATE.failed));
  }, []);

  const pictures = useMemo(
    () => (picturesByTerm ? matchingPictures(query, picturesByTerm) : []),
    [query, picturesByTerm]
  );

  return { pictures, requestState };
}
