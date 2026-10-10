'use client';

import {
  useEffect,
  useState,
  type Dispatch,
  type JSX,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useLinkStatus } from 'next/link';
import { createRequiredContext } from './create-required-context';

interface Loader {
  isLoaderShown: boolean;
  setPendingLoaderCount: Dispatch<SetStateAction<number>>;
}

const [LoaderContextProvider, useLoader] =
  createRequiredContext<Loader>('LoaderProvider');

interface LoaderProviderProps {
  children: ReactNode;
}

export function LoaderProvider({ children }: LoaderProviderProps): JSX.Element {
  const [pendingLoaderCount, setPendingLoaderCount] = useState(0);
  const loader: Loader = {
    isLoaderShown: pendingLoaderCount > 0,
    setPendingLoaderCount,
  };

  return (
    <LoaderContextProvider value={loader}>{children}</LoaderContextProvider>
  );
}

export function useIsLoaderShown(): boolean {
  return useLoader().isLoaderShown;
}

export function useReportLoader(isPending: boolean): void {
  const { setPendingLoaderCount } = useLoader();

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
