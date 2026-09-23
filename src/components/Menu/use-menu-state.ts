'use client';

import { useCallback, useState } from 'react';
import { createRequiredContext } from '@/hooks/create-required-context';

export interface MenuState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const [MenuProvider, useMenu] =
  createRequiredContext<MenuState>('MenuProvider');

export function useMenuState(): MenuState {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback((): void => {
    setIsOpen((wasOpen) => !wasOpen);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  return { isOpen, toggle, close };
}
