'use client';

import { RefObject, useEffect, useRef } from 'react';
import { useCloseOnBack } from '@/hooks/use-close-on-back';
import { useEscapeKey } from '@/hooks/use-escape-key';

export function useModal(onClose: () => void): RefObject<HTMLDivElement | null> {
  const modalRef = useRef<HTMLDivElement>(null);
  const isOnTop = useCloseOnBack(onClose);

  const closeIfOnTop = (): void => {
    if (isOnTop()) {
      onClose();
    }
  };

  useEscapeKey({ isListening: true, onEscape: closeIfOnTop, takesPrecedence: true });

  useEffect(() => {
    const focusedBeforeOpening = document.activeElement;
    modalRef.current?.focus();

    return (): void => {
      if (focusedBeforeOpening instanceof HTMLElement) {
        focusedBeforeOpening.focus();
      }
    };
  }, []);

  return modalRef;
}
