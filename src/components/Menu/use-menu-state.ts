'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRequiredContext } from '@/hooks/create-required-context';

export interface MenuState {
  isOpen: boolean;
  toggle: () => void;
  closeMenu: () => void;
  whenMenuCloses: (step: () => void) => void;
}

export const [MenuProvider, useMenu] =
  createRequiredContext<MenuState>('MenuProvider');

function useWhenMenuCloses(isOpen: boolean): (step: () => void) => void {
  const stepsRef = useRef<Array<() => void>>([]);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;

    if (isOpen) {
      return;
    }

    const steps = stepsRef.current;
    stepsRef.current = [];
    steps.forEach((step) => step());
  }, [isOpen]);

  return useCallback((step: () => void): void => {
    if (!isOpenRef.current) {
      step();
      return;
    }

    stepsRef.current.push(step);
  }, []);
}

export function useMenuState(): MenuState {
  const [isOpen, setIsOpen] = useState(false);
  const whenMenuCloses = useWhenMenuCloses(isOpen);

  const toggle = useCallback((): void => {
    setIsOpen((wasOpen) => !wasOpen);
  }, []);

  const closeMenu = useCallback((): void => {
    setIsOpen(false);
  }, []);

  return useMemo(
    () => ({ isOpen, toggle, closeMenu, whenMenuCloses }),
    [isOpen, toggle, closeMenu, whenMenuCloses]
  );
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
