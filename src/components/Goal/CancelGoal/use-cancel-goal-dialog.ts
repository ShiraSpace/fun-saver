'use client';

import { RefObject, useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useModal } from '@/hooks/use-modal';
import type { CancelGoalRequest } from './use-cancel-goal';
import { TAB_KEY } from './constants';

type CancelGoalDialogOptions = Pick<
  CancelGoalRequest,
  'isCancelling' | 'cancelFailed' | 'keepGoal'
>;

interface CancelGoalDialog {
  dialogRef: RefObject<HTMLDivElement | null>;
  keepGoalRef: RefObject<HTMLButtonElement | null>;
  holdToCancelRef: RefObject<HTMLButtonElement | null>;
  keepFocusInside: (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => void;
}

export function useCancelGoalDialog({
  isCancelling,
  cancelFailed,
  keepGoal,
}: CancelGoalDialogOptions): CancelGoalDialog {
  const dialogRef = useModal(keepGoal);
  const keepGoalRef = useRef<HTMLButtonElement>(null);
  const holdToCancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const focusHolder = isCancelling ? dialogRef : keepGoalRef;
    focusHolder.current?.focus();
  }, [isCancelling, cancelFailed, dialogRef]);

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
