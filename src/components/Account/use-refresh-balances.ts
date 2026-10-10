import { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useReportPendingNavigation } from '@/hooks/navigation-pending-context';

export function useRefreshBalances(): () => void {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  useReportPendingNavigation(isRefreshing);

  return useCallback(
    (): void => startRefresh(() => router.refresh()),
    [router]
  );
}
