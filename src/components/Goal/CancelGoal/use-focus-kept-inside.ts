'use client';

import { RefObject, useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { TAB_KEY } from './constants';

interface FocusKeptInside {
  firstRef: RefObject<HTMLButtonElement | null>;
  lastRef: RefObject<HTMLButtonElement | null>;
  onKeyDown: (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => void;
}

export function useFocusKeptInside(): FocusKeptInside {
  const firstRef = useRef<HTMLButtonElement>(null);
  const lastRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const onKeyDown = (keyboardEvent: ReactKeyboardEvent<HTMLElement>): void => {
    if (keyboardEvent.key !== TAB_KEY) {
      return;
    }

    const [edge, wrapTo] = keyboardEvent.shiftKey
      ? [firstRef.current, lastRef.current]
      : [lastRef.current, firstRef.current];

    if (document.activeElement === edge) {
      keyboardEvent.preventDefault();
      wrapTo?.focus();
    }
  };

  return { firstRef, lastRef, onKeyDown };
}
