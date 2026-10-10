import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useReportPendingNavigation } from '@/components/Header/navigation-pending-context';

export function useRefreshBalances(): () => void {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  useReportPendingNavigation(isRefreshing);

  return (): void => startRefresh(() => router.refresh());
}
