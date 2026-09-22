'use client';

import { useEffect } from 'react';
import { ESCAPE_KEY } from './constants';

export function useEscapeKey(isListening: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!isListening) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === ESCAPE_KEY) {
        onEscape();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return (): void => document.removeEventListener('keydown', onKeyDown);
  }, [isListening, onEscape]);
}
