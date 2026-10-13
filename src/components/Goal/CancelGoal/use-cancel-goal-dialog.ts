'use client';

import { RefObject, useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { useModal } from '@/hooks/use-modal';
import { TAB_KEY } from './constants';

interface CancelGoalDialogOptions {
  requestState: RequestState;
  onKeepGoal: () => void;
}

interface CancelGoalDialog {
  dialogRef: RefObject<HTMLDivElement | null>;
  keepGoalRef: RefObject<HTMLButtonElement | null>;
  holdToCancelRef: RefObject<HTMLButtonElement | null>;
  keepFocusInside: (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => void;
}

export function useCancelGoalDialog({
  requestState,
  onKeepGoal,
}: CancelGoalDialogOptions): CancelGoalDialog {
  const dialogRef = useModal(onKeepGoal);
  const keepGoalRef = useRef<HTMLButtonElement>(null);
  const holdToCancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const focusHolder = requestState === REQUEST_STATE.pending ? dialogRef : keepGoalRef;
    focusHolder.current?.focus();
  }, [requestState, dialogRef]);

  const keepFocusInside = (keyboardEvent: ReactKeyboardEvent<HTMLElement>): void => {
    if (keyboardEvent.key !== TAB_KEY) {
      return;
    }

    const entryButton = keyboardEvent.shiftKey ? holdToCancelRef.current : keepGoalRef.current;

    if (document.activeElement !== entryButton) {
      keyboardEvent.preventDefault();
      entryButton?.focus();
    }
  };

  return { dialogRef, keepGoalRef, holdToCancelRef, keepFocusInside };
}
