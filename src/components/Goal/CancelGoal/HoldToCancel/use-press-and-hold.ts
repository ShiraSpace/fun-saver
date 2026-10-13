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
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
  onKeyUp: () => void;
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

function isFirstPressOfHoldKey(event: ReactKeyboardEvent<HTMLElement>): boolean {
  return HOLD_KEYS.includes(event.key) && !event.repeat;
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
      onPointerDown: (event): void => {
        if (event.button !== PRIMARY_POINTER_BUTTON) {
          return;
        }

        event.currentTarget.releasePointerCapture?.(event.pointerId);
        startHolding();
      },
      onPointerUp: letGo,
      onPointerCancel: letGo,
      onPointerLeave: letGo,
      onKeyDown: (event): void => {
        if (isFirstPressOfHoldKey(event)) {
          startHolding();
        }
      },
      onKeyUp: letGo,
      onBlur: letGo,
    },
  };
}
