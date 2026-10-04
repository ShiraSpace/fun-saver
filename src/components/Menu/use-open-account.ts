'use client';

import { useAccounts } from '@/components/Home/accounts-context';
import { useMenu } from './use-menu-state';

export function useOpenAccount(): (id: string) => void {
  const { switchAccount } = useAccounts();
  const { closeMenu } = useMenu();

  return (id: string): void => {
    switchAccount(id);
    closeMenu();
  };
}
