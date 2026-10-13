'use client';

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react';
import { useModal } from '@/hooks/use-modal';
import { TAB_KEY } from '@/hooks/constants';
import type { GoalCancellation } from './use-cancel-goal';

type CancelGoalDialogOptions = Pick<GoalCancellation, 'isCancelling' | 'keepGoal'>;

interface CancelGoalDialog {
  dialogRef: RefObject<HTMLDivElement | null>;
  keepGoalRef: RefObject<HTMLButtonElement | null>;
  holdToCancelRef: RefObject<HTMLButtonElement | null>;
  keepFocusInside: (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => void;
}

export function useCancelGoalDialog({
  isCancelling,
  keepGoal,
}: CancelGoalDialogOptions): CancelGoalDialog {
  const dialogRef = useModal(keepGoal);
  const keepGoalRef = useRef<HTMLButtonElement>(null);
  const holdToCancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const focusHolder = isCancelling ? dialogRef : keepGoalRef;
    focusHolder.current?.focus();
  }, [isCancelling, dialogRef]);

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
