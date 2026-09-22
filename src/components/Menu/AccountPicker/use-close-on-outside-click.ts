'use client';

import { RefObject, useEffect } from 'react';
import { OUTSIDE_CLICK_EVENT } from './constants';

export function useCloseOnOutsideClick(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void
): void {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onOutsideClick = (event: MouseEvent): void => {
      if (ref.current?.contains(event.target as Node)) {
        return;
      }

      onClose();
    };

    document.addEventListener(OUTSIDE_CLICK_EVENT, onOutsideClick);

    return (): void =>
      document.removeEventListener(OUTSIDE_CLICK_EVENT, onOutsideClick);
  }, [ref, isOpen, onClose]);
}
