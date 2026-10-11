'use client';

import { RefObject, useEffect, useRef } from 'react';
import { useCloseOnBack } from './use-close-on-back';
import { useEscapeKey } from './use-escape-key';

export function useModal(
  onClose: () => void
): RefObject<HTMLDivElement | null> {
  const modalRef = useRef<HTMLDivElement>(null);

  useEscapeKey({ isListening: true, onEscape: onClose, takesPrecedence: true });
  useCloseOnBack(onClose);

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
