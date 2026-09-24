'use client';

import { JSX } from 'react';
import {
  APP_MODE,
  useAppMode,
} from '@/components/AccountManagement/app-mode-context';
import {
  ACCOUNT_LIST_CONTENT,
  ACCOUNT_LIST_TEST_IDS,
} from '../AccountList/constants';
import { AddButton } from '../row-parts';
import { useMenu } from '../use-menu-state';

export function AddAccountButton(): JSX.Element {
  const { setMode } = useAppMode();
  const { closeMenu } = useMenu();

  const startCreatingAccount = (): void => {
    closeMenu();
    setMode(APP_MODE.creatingAccount);
  };

  return (
    <AddButton
      type="button"
      aria-label={ACCOUNT_LIST_CONTENT.addAccessibleLabel}
      data-testid={ACCOUNT_LIST_TEST_IDS.addAccount}
      onClick={startCreatingAccount}
    >
      {ACCOUNT_LIST_CONTENT.addLabel}
    </AddButton>
  );
}
