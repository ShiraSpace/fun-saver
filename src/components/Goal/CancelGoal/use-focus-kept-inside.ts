'use client';

import { RefObject, useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { TAB_KEY } from './constants';

interface FocusKeptInside {
  firstRef: RefObject<HTMLButtonElement | null>;
  lastRef: RefObject<HTMLButtonElement | null>;
  onKeyDown: (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => void;
}

function isOnEitherButton(...buttons: (HTMLButtonElement | null)[]): boolean {
  return buttons.some((button) => button !== null && button === document.activeElement);
}

export function useFocusKeptInside(requestState: RequestState): FocusKeptInside {
  const firstRef = useRef<HTMLButtonElement>(null);
  const lastRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (requestState !== REQUEST_STATE.pending) {
      firstRef.current?.focus();
    }
  }, [requestState]);

  const onKeyDown = (keyboardEvent: ReactKeyboardEvent<HTMLElement>): void => {
    if (keyboardEvent.key !== TAB_KEY) {
      return;
    }

    const [edge, wrapTo] = keyboardEvent.shiftKey
      ? [firstRef.current, lastRef.current]
      : [lastRef.current, firstRef.current];

    if (isOnEitherButton(edge) || !isOnEitherButton(firstRef.current, lastRef.current)) {
      keyboardEvent.preventDefault();
      wrapTo?.focus();
    }
  };

  return { firstRef, lastRef, onKeyDown };
}
