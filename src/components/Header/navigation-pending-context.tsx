'use client';

import { createContext, useContext, useEffect } from 'react';
import { useLinkStatus } from 'next/link';

type ReportPending = (isPending: boolean) => void;

const ReportPendingContext = createContext<ReportPending>(() => {});

export const NavigationPendingProvider = ReportPendingContext.Provider;

export function PendingNavigationReporter(): null {
  const { pending } = useLinkStatus();
  const reportPending = useContext(ReportPendingContext);

  useEffect((): void => {
    reportPending(pending);
  }, [pending, reportPending]);

  return null;
}
