'use client';

import { useEffect } from 'react';
import { ESCAPE_KEY, KEY_DOWN_EVENT } from './constants';

interface EscapeKeyOptions {
  isListening: boolean;
  onEscape: () => void;
  takesPrecedence?: boolean;
}

export function useEscapeKey({
  isListening,
  onEscape,
  takesPrecedence = false,
}: EscapeKeyOptions): void {
  useEffect(() => {
    if (!isListening) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== ESCAPE_KEY) {
        return;
      }

      if (takesPrecedence) {
        event.stopPropagation();
      }

      onEscape();
    };

    document.addEventListener(KEY_DOWN_EVENT, onKeyDown, takesPrecedence);

    return (): void =>
      document.removeEventListener(KEY_DOWN_EVENT, onKeyDown, takesPrecedence);
  }, [isListening, onEscape, takesPrecedence]);
}
