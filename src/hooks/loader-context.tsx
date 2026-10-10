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

const PendingLoadersContext = createContext<Dispatch<SetStateAction<number>>>(
  () => {}
);

const [IsLoaderShownProvider, useIsLoaderShown] =
  createRequiredContext<boolean>('LoaderProvider');

export { useIsLoaderShown };

interface LoaderProviderProps {
  children: ReactNode;
}

export function LoaderProvider({ children }: LoaderProviderProps): JSX.Element {
  const [pendingLoaderCount, setPendingLoaderCount] = useState(0);

  return (
    <PendingLoadersContext.Provider value={setPendingLoaderCount}>
      <IsLoaderShownProvider value={pendingLoaderCount > 0}>
        {children}
      </IsLoaderShownProvider>
    </PendingLoadersContext.Provider>
  );
}

export function useReportLoader(isPending: boolean): void {
  const setPendingLoaderCount = useContext(PendingLoadersContext);

  useEffect((): (() => void) | undefined => {
    if (!isPending) {
      return;
    }

    setPendingLoaderCount((count) => count + 1);

    return (): void => setPendingLoaderCount((count) => count - 1);
  }, [isPending, setPendingLoaderCount]);
}

export function LinkLoaderReporter(): null {
  const { pending } = useLinkStatus();

  useReportLoader(pending);

  return null;
}
