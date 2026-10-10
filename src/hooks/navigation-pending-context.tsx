'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type JSX,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useLinkStatus } from 'next/link';
import { createRequiredContext } from './create-required-context';

const PendingNavigationsContext = createContext<
  Dispatch<SetStateAction<number>>
>(() => {});

const [IsNavigatingProvider, useIsNavigating] =
  createRequiredContext<boolean>('NavigationProvider');

export { useIsNavigating };

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({
  children,
}: NavigationProviderProps): JSX.Element {
  const [pendingNavigationCount, setPendingNavigationCount] = useState(0);

  return (
    <PendingNavigationsContext.Provider value={setPendingNavigationCount}>
      <IsNavigatingProvider value={pendingNavigationCount > 0}>
        {children}
      </IsNavigatingProvider>
    </PendingNavigationsContext.Provider>
  );
}

export function useReportPendingNavigation(isPending: boolean): void {
  const setPendingNavigationCount = useContext(PendingNavigationsContext);

  useEffect((): (() => void) | undefined => {
    if (!isPending) {
      return;
    }

    setPendingNavigationCount((count) => count + 1);

    return (): void => setPendingNavigationCount((count) => count - 1);
  }, [isPending, setPendingNavigationCount]);
}

export function PendingNavigationReporter(): null {
  const { pending } = useLinkStatus();

  useReportPendingNavigation(pending);

  return null;
}
