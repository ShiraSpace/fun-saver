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
import { AddRow } from '../row-parts';
import { useMenu } from '../use-menu-state';

export function AddAccountRow(): JSX.Element {
  const { setMode } = useAppMode();
  const { close } = useMenu();

  const handleAddAccount = (): void => {
    close();
    setMode(APP_MODE.creatingAccount);
  };

  return (
    <AddRow
      type="button"
      aria-label={ACCOUNT_LIST_CONTENT.addAccessibleLabel}
      data-testid={ACCOUNT_LIST_TEST_IDS.addRow}
      onClick={handleAddAccount}
    >
      {ACCOUNT_LIST_CONTENT.addLabel}
    </AddRow>
  );
}
