'use client';

import {
  createContext,
  useContext,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useLinkStatus } from 'next/link';

const PendingNavigationsContext = createContext<
  Dispatch<SetStateAction<number>>
>(() => {});

export const PendingNavigationsProvider = PendingNavigationsContext.Provider;

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
