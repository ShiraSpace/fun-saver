'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { HOLD_KEYS, PRIMARY_POINTER_BUTTON } from './constants';

interface PressAndHoldOptions {
  holdMs: number;
  isDisabled: boolean;
  onHeld: () => void;
}

export interface PressAndHoldHandlers {
  onPointerDown: (pointerEvent: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
  onKeyDown: (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => void;
  onKeyUp: (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => void;
  onBlur: () => void;
}

interface PressAndHold {
  isHolding: boolean;
  handlers: PressAndHoldHandlers;
}

interface HoldTimer {
  isHolding: boolean;
  startHolding: () => void;
  letGo: () => void;
}

function isHoldKey(keyboardEvent: ReactKeyboardEvent<HTMLElement>): boolean {
  return HOLD_KEYS.includes(keyboardEvent.key);
}

function isFirstPressOfHoldKey(keyboardEvent: ReactKeyboardEvent<HTMLElement>): boolean {
  return isHoldKey(keyboardEvent) && !keyboardEvent.repeat;
}

function useHoldTimer({ holdMs, isDisabled, onHeld }: PressAndHoldOptions): HoldTimer {
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onHeldRef = useRef(onHeld);

  useEffect(() => {
    onHeldRef.current = onHeld;
  });

  useEffect(() => (): void => clearTimeout(holdTimerRef.current), []);

  const letGo = (): void => {
    clearTimeout(holdTimerRef.current);
    setIsHolding(false);
  };

  const startHolding = (): void => {
    if (isDisabled) {
      return;
    }

    clearTimeout(holdTimerRef.current);
    setIsHolding(true);
    holdTimerRef.current = setTimeout(() => {
      setIsHolding(false);
      onHeldRef.current();
    }, holdMs);
  };

  return { isHolding, startHolding, letGo };
}

export function usePressAndHold(options: PressAndHoldOptions): PressAndHold {
  const { isHolding, startHolding, letGo } = useHoldTimer(options);

  return {
    isHolding,
    handlers: {
      onPointerDown: (pointerEvent): void => {
        if (pointerEvent.button !== PRIMARY_POINTER_BUTTON) {
          return;
        }

        pointerEvent.currentTarget.releasePointerCapture?.(pointerEvent.pointerId);
        startHolding();
      },
      onPointerUp: letGo,
      onPointerCancel: letGo,
      onPointerLeave: letGo,
      onKeyDown: (keyboardEvent): void => {
        if (isFirstPressOfHoldKey(keyboardEvent)) {
          startHolding();
        }
      },
      onKeyUp: (keyboardEvent): void => {
        if (isHoldKey(keyboardEvent)) {
          letGo();
        }
      },
      onBlur: letGo,
    },
  };
}
