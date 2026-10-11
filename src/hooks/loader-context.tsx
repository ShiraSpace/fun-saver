'use client';

import {
  useEffect,
  useState,
  useTransition,
  type Dispatch,
  type JSX,
  type ReactNode,
  type SetStateAction,
  type TransitionStartFunction,
} from 'react';
import { useLinkStatus } from 'next/link';
import { useRouter } from 'next/navigation';
import { createRequiredContext } from './create-required-context';

interface Loader {
  isLoaderShown: boolean;
  setPendingLoaderCount: Dispatch<SetStateAction<number>>;
  runWithLoader: TransitionStartFunction;
}

const [LoaderContextProvider, useLoader] = createRequiredContext<Loader>('LoaderProvider');

interface LoaderProviderProps {
  children: ReactNode;
}

export function LoaderProvider({ children }: LoaderProviderProps): JSX.Element {
  const [pendingLoaderCount, setPendingLoaderCount] = useState(0);
  const [isRunning, runWithLoader] = useTransition();
  const loader: Loader = {
    isLoaderShown: isRunning || pendingLoaderCount > 0,
    setPendingLoaderCount,
    runWithLoader,
  };

  return <LoaderContextProvider value={loader}>{children}</LoaderContextProvider>;
}

export function useIsLoaderShown(): boolean {
  return useLoader().isLoaderShown;
}

export function useRefreshWithLoader(): () => void {
  const router = useRouter();
  const { runWithLoader } = useLoader();

  return (): void => runWithLoader(() => router.refresh());
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
