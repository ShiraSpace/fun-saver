'use client';

import {
  createContext,
  useContext,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useLinkStatus } from 'next/link';

const PendingLinksContext = createContext<Dispatch<SetStateAction<number>>>(
  () => {}
);

export const PendingLinksProvider = PendingLinksContext.Provider;

export function PendingNavigationReporter(): null {
  const { pending } = useLinkStatus();
  const countPendingLinks = useContext(PendingLinksContext);

  useEffect((): (() => void) | undefined => {
    if (!pending) {
      return;
    }

    countPendingLinks((count) => count + 1);

    return (): void => countPendingLinks((count) => count - 1);
  }, [pending, countPendingLinks]);

  return null;
}
