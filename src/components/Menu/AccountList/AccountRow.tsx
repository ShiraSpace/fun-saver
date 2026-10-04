'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { VIEW_MODE } from '@/lib/account/view-mode';
import { REQUEST_STATE } from '@/lib/request-state';
import { ListedAccount } from './AccountList.styles';
import { AccountPickButton } from './AccountPickButton';
import { ChildViewToggle } from './ChildViewToggle';
import { useAccountViewMode } from '../ViewModeSwitch/use-account-view-mode';
import { ViewModeSaveError } from '../ViewModeSwitch/ViewModeSaveError';
import { SAVED_VIEW_MODE_SHOWN } from '../ViewModeSwitch/constants';

interface AccountRowProps {
  account: AccountSummary;
  isCurrent: boolean;
  onSelect: (id: string) => void;
}

export function AccountRow({
  account,
  isCurrent,
  onSelect,
}: AccountRowProps): JSX.Element {
  const { chooseViewMode, chosenViewMode, requestState } = useAccountViewMode(
    account,
    SAVED_VIEW_MODE_SHOWN.whenMenuCloses
  );
  const isShownToChild =
    (chosenViewMode ?? account.viewMode) === VIEW_MODE.child;

  const toggleChildView = (): void =>
    chooseViewMode(isShownToChild ? VIEW_MODE.parent : VIEW_MODE.child);

  return (
    <div>
      <ListedAccount data-current={isCurrent}>
        <AccountPickButton
          account={account}
          isCurrent={isCurrent}
          onSelect={onSelect}
        />
        <ChildViewToggle
          accountName={account.name}
          isShownToChild={isShownToChild}
          isSaving={requestState === REQUEST_STATE.pending}
          onToggle={toggleChildView}
        />
      </ListedAccount>
      <ViewModeSaveError requestState={requestState} />
    </div>
  );
}
