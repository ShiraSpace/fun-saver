'use client';

import { useCallback, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { SWIPE_TO_CLOSE } from './constants';

interface SwipeToClose {
  offset: number;
  isDragging: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
}

export function useSwipeToClose(onClose: () => void): SwipeToClose {
  const startYRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>): void => {
      event.currentTarget.setPointerCapture?.(event.pointerId);
      startYRef.current = event.clientY;
      setIsDragging(true);
    },
    []
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>): void => {
      if (startYRef.current === null) {
        return;
      }

      setOffset(Math.max(0, event.clientY - startYRef.current));
    },
    []
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>): void => {
      if (startYRef.current === null) {
        return;
      }

      const draggedBy = Math.max(0, event.clientY - startYRef.current);
      startYRef.current = null;
      setIsDragging(false);
      setOffset(0);

      if (draggedBy > SWIPE_TO_CLOSE.closeThreshold) {
        onClose();
      }
    },
    [onClose]
  );

  return { offset, isDragging, onPointerDown, onPointerMove, onPointerUp };
}
