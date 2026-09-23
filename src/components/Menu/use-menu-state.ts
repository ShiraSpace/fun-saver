'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  return useMemo(() => ({ isOpen, toggle, close }), [isOpen, toggle, close]);
}

export function useOnMenuClose(onMenuClose: () => void): void {
  const { isOpen } = useMenu();
  const onMenuCloseRef = useRef(onMenuClose);
  const wasOpenRef = useRef(isOpen);

  useEffect(() => {
    onMenuCloseRef.current = onMenuClose;
  });

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      onMenuCloseRef.current();
    }

    wasOpenRef.current = isOpen;
  }, [isOpen]);
}
