'use client';

import { useEffect, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react';
import { useModal } from '@/hooks/use-modal';
import { TAB_KEY } from '@/hooks/constants';
import { REQUEST_STATE } from '@/lib/request-state';
import type { GoalCancellation } from './use-cancel-goal';

type CancelGoalDialogOptions = Pick<GoalCancellation, 'requestState' | 'keepGoal'>;

interface CancelGoalDialog {
  dialogRef: RefObject<HTMLDivElement | null>;
  keepFocusInside: (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => void;
}

function buttonsIn(dialog: HTMLElement | null): HTMLButtonElement[] {
  return Array.from(dialog?.querySelectorAll('button') ?? []);
}

export function useCancelGoalDialog({
  requestState,
  keepGoal,
}: CancelGoalDialogOptions): CancelGoalDialog {
  const dialogRef = useModal(keepGoal);
  const isCancelling = requestState === REQUEST_STATE.pending;

  useEffect(() => {
    const focusHolder = isCancelling ? dialogRef.current : buttonsIn(dialogRef.current)[0];
    focusHolder?.focus();
  }, [isCancelling, dialogRef]);

  const keepFocusInside = (keyboardEvent: ReactKeyboardEvent<HTMLElement>): void => {
    if (keyboardEvent.key !== TAB_KEY) {
      return;
    }

    const buttons = buttonsIn(keyboardEvent.currentTarget);
    const entryButton = keyboardEvent.shiftKey ? buttons.at(-1) : buttons[0];

    if (document.activeElement !== entryButton) {
      keyboardEvent.preventDefault();
      entryButton?.focus();
    }
  };

  return { dialogRef, keepFocusInside };
}
