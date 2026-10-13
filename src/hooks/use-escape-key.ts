'use client';

import { useEffect, useRef } from 'react';
import { ESCAPE_KEY, KEY_DOWN_EVENT } from './constants';

interface EscapeKeyOptions {
  isListening: boolean;
  onEscape: () => void;
  takesPrecedence?: boolean;
}

type EscapeListener = (event: KeyboardEvent) => void;

const listenersTakingPrecedence: EscapeListener[] = [];

function isOutranked(listener: EscapeListener): boolean {
  const topListener = listenersTakingPrecedence.at(-1);

  return topListener !== undefined && topListener !== listener;
}

export function useEscapeKey({
  isListening,
  onEscape,
  takesPrecedence = false,
}: EscapeKeyOptions): void {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!isListening) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== ESCAPE_KEY || (takesPrecedence && isOutranked(onKeyDown))) {
        return;
      }

      if (takesPrecedence) {
        event.stopPropagation();
      }

      onEscapeRef.current();
    };

    if (takesPrecedence) {
      listenersTakingPrecedence.push(onKeyDown);
    }

    document.addEventListener(KEY_DOWN_EVENT, onKeyDown, takesPrecedence);

    return (): void => {
      document.removeEventListener(KEY_DOWN_EVENT, onKeyDown, takesPrecedence);

      if (takesPrecedence) {
        listenersTakingPrecedence.splice(listenersTakingPrecedence.indexOf(onKeyDown), 1);
      }
    };
  }, [isListening, takesPrecedence]);
}
