'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

export function useOnMenuClose(onMenuClose: () => void): void {
  const { isOpen } = useMenu();
  const onMenuCloseRef = useRef(onMenuClose);

  useEffect(() => {
    onMenuCloseRef.current = onMenuClose;
  });

  useEffect(() => {
    if (!isOpen) {
      onMenuCloseRef.current();
    }
  }, [isOpen]);
}
