'use client';

import { useSyncExternalStore } from 'react';
import { createRequiredContext } from '@/hooks/create-required-context';
import { collectedInterestCookie, readCookie, writeCookie } from '@/lib/cookies';
import type { CollectedInterestCookies } from '@/lib/interest/collected-interest';

interface CollectedInterestValue {
  storedCollectedInterest: string | undefined;
  readStoredCollectedInterest: () => string | undefined;
  saveCollectedInterest: (collectedInterest: number) => void;
}

const [CollectedInterestProvider, useCollectedInterestOnServer] =
  createRequiredContext<CollectedInterestCookies>('CollectedInterestProvider');

export { CollectedInterestProvider };

function noReaderNeedsTelling(): () => void {
  return (): void => {};
}

export function useCollectedInterest(accountId: string): CollectedInterestValue {
  const collectedInterestOnServer = useCollectedInterestOnServer();
  const cookieName = collectedInterestCookie(accountId);
  const readStoredCollectedInterest = (): string | undefined => readCookie(cookieName);
  const storedCollectedInterest = useSyncExternalStore(
    noReaderNeedsTelling,
    readStoredCollectedInterest,
    (): string | undefined => collectedInterestOnServer[accountId]
  );

  return {
    storedCollectedInterest,
    readStoredCollectedInterest,
    saveCollectedInterest: (collectedInterest: number): void =>
      writeCookie(cookieName, String(collectedInterest)),
  };
}
