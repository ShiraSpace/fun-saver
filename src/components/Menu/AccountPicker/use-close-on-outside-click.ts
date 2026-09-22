'use client';

import { RefObject, useEffect } from 'react';
import { OUTSIDE_CLICK_EVENT } from './constants';

interface OutsideClickOptions {
  ref: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

export function useCloseOnOutsideClick({
  ref,
  isOpen,
  onClose,
}: OutsideClickOptions): void {
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
