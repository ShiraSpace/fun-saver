'use client';

import { RefObject, useEffect, useRef } from 'react';
import { useCloseOnBack } from '@/hooks/use-close-on-back';
import { useEscapeKey } from '@/hooks/use-escape-key';

export function useModalSheet(
  onClose: () => void
): RefObject<HTMLDivElement | null> {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEscapeKey({ isListening: true, onEscape: onClose, takesPrecedence: true });
  useCloseOnBack(onClose);

  useEffect(() => {
    const focusedBeforeOpening = document.activeElement;
    sheetRef.current?.focus();

    return (): void => {
      if (focusedBeforeOpening instanceof HTMLElement) {
        focusedBeforeOpening.focus();
      }
    };
  }, []);

  return sheetRef;
}
