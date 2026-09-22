'use client';

import { useEffect } from 'react';
import { ESCAPE_KEY, KEY_DOWN_EVENT } from './constants';

interface EscapeKeyOptions {
  isListening: boolean;
  onEscape: () => void;
}

export function useEscapeKey({
  isListening,
  onEscape,
}: EscapeKeyOptions): void {
  useEffect(() => {
    if (!isListening) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === ESCAPE_KEY) {
        onEscape();
      }
    };

    document.addEventListener(KEY_DOWN_EVENT, onKeyDown);

    return (): void => document.removeEventListener(KEY_DOWN_EVENT, onKeyDown);
  }, [isListening, onEscape]);
}
