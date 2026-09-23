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

interface AddAccountRowProps {
  onLeaveMenu: () => void;
}

export function AddAccountRow({
  onLeaveMenu,
}: AddAccountRowProps): JSX.Element {
  const { setMode } = useAppMode();

  const handleAddAccount = (): void => {
    onLeaveMenu();
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
