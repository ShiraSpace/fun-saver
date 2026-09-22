'use client';

import { useCallback, useState } from 'react';

export interface MenuState {
  isOpen: boolean;
  isAccountListOpen: boolean;
  toggle: () => void;
  close: () => void;
  setAccountListOpen: (isOpen: boolean) => void;
}

export function useMenuState(): MenuState {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountListOpen, setIsAccountListOpen] = useState(false);

  const toggle = useCallback((): void => {
    setIsAccountListOpen(false);
    setIsOpen((wasOpen) => !wasOpen);
  }, []);

  const close = useCallback((): void => {
    setIsAccountListOpen(false);
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    isAccountListOpen,
    toggle,
    close,
    setAccountListOpen: setIsAccountListOpen,
  };
}
