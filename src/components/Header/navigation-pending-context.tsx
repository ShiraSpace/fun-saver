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

const PendingNavigationsContext = createContext<
  Dispatch<SetStateAction<number>>
>(() => {});

const IsNavigatingContext = createContext(false);

interface PendingNavigationsProps {
  children: ReactNode;
}

export function PendingNavigations({
  children,
}: PendingNavigationsProps): JSX.Element {
  const [pendingNavigationCount, setPendingNavigationCount] = useState(0);

  return (
    <PendingNavigationsContext.Provider value={setPendingNavigationCount}>
      <IsNavigatingContext.Provider value={pendingNavigationCount > 0}>
        {children}
      </IsNavigatingContext.Provider>
    </PendingNavigationsContext.Provider>
  );
}

export function useIsNavigating(): boolean {
  return useContext(IsNavigatingContext);
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
