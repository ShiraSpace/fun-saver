'use client';

import { useEffect, useRef, useState } from 'react';
import { HOLD_KEYS, PRIMARY_POINTER_BUTTON } from './constants';

interface HoldToCancelOptions {
  holdMs: number;
  isCancelling: boolean;
  onHeld: () => void;
}

export interface HoldPointerEvent {
  button: number;
  pointerId: number;
  currentTarget: { releasePointerCapture?: (pointerId: number) => void };
}

export interface HoldKeyEvent {
  key: string;
}

export interface HoldHandlers {
  onPointerDown: (pointerEvent: HoldPointerEvent) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
  onKeyDown: (keyboardEvent: HoldKeyEvent) => void;
  onKeyUp: (keyboardEvent: HoldKeyEvent) => void;
  onBlur: () => void;
}

interface HoldToCancelState {
  isHolding: boolean;
  handlers: HoldHandlers;
}

interface Hold {
  isHolding: boolean;
  startHolding: () => void;
  letGo: () => void;
  pressKey: (key: string) => void;
  releaseKey: (key: string) => void;
}

function isHoldKey(keyboardEvent: HoldKeyEvent): boolean {
  return HOLD_KEYS.includes(keyboardEvent.key);
}

function useHold({ holdMs, isCancelling, onHeld }: HoldToCancelOptions): Hold {
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const heldKeyRef = useRef<string | null>(null);
  const onHeldRef = useRef(onHeld);

  useEffect(() => {
    onHeldRef.current = onHeld;
  });

  useEffect(() => (): void => clearTimeout(holdTimerRef.current), []);

  const letGo = (): void => {
    clearTimeout(holdTimerRef.current);
    heldKeyRef.current = null;
    setIsHolding(false);
  };

  const startHolding = (): void => {
    if (isCancelling) {
      return;
    }

    clearTimeout(holdTimerRef.current);
    setIsHolding(true);
    holdTimerRef.current = setTimeout(() => {
      setIsHolding(false);
      onHeldRef.current();
    }, holdMs);
  };

  const pressKey = (key: string): void => {
    if (isCancelling || heldKeyRef.current !== null) {
      return;
    }

    startHolding();
    heldKeyRef.current = key;
  };

  const releaseKey = (key: string): void => {
    if (key === heldKeyRef.current) {
      letGo();
    }
  };

  return { isHolding, startHolding, letGo, pressKey, releaseKey };
}

export function useHoldToCancel(options: HoldToCancelOptions): HoldToCancelState {
  const { isHolding, startHolding, letGo, pressKey, releaseKey } = useHold(options);

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
        if (isHoldKey(keyboardEvent)) {
          pressKey(keyboardEvent.key);
        }
      },
      onKeyUp: (keyboardEvent): void => {
        releaseKey(keyboardEvent.key);
      },
      onBlur: letGo,
    },
  };
}
