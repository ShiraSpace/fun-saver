import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useReportLoader } from '@/hooks/loader-context';

export function useRefreshBalances(): () => void {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  useReportLoader(isRefreshing);

  return (): void => startRefresh(() => router.refresh());
}
