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

let loadedPicturesByTerm: PicturesByTerm | undefined;

async function loadPicturesByTerm(): Promise<PicturesByTerm> {
  const { default: pictureWords } =
    await import('@/lib/goal/picture-search/picture-words.he.json');
  loadedPicturesByTerm = indexPictureWords(pictureWords);

  return loadedPicturesByTerm;
}

export function useMatchingPictures(query: string): MatchingPictures {
  const [picturesByTerm, setPicturesByTerm] = useState(loadedPicturesByTerm);
  const [requestState, setRequestState] = useState<RequestState>(
    loadedPicturesByTerm ? REQUEST_STATE.idle : REQUEST_STATE.pending
  );

  useEffect(() => {
    if (loadedPicturesByTerm) {
      return;
    }

    void loadPicturesByTerm()
      .then((picturesByTerm) => {
        setPicturesByTerm(picturesByTerm);
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
