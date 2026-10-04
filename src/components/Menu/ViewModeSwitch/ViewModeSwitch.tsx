'use client';

import { JSX } from 'react';
import { useAccounts } from '@/components/Home/accounts-context';
import { VIEW_MODE, type ViewMode } from '@/lib/account/view-mode';
import { REQUEST_STATE } from '@/lib/request-state';
import { useAccountViewMode } from './use-account-view-mode';
import {
  SAVED_VIEW_MODE_SHOWN,
  VIEW_MODE_SWITCH_COPY,
  VIEW_MODE_SWITCH_TEST_IDS,
} from './constants';
import { Icon, Label, Note, Row } from './ViewModeSwitch.styles';
import { ViewModeSaveError } from './ViewModeSaveError';
import { Track } from '../switch-parts';

interface ViewModeSwitchProps {
  viewMode: ViewMode;
}

export function ViewModeSwitch({ viewMode }: ViewModeSwitchProps): JSX.Element {
  const { currentAccount } = useAccounts();
  const { chooseViewMode, chosenViewMode, requestState } = useAccountViewMode(
    currentAccount,
    SAVED_VIEW_MODE_SHOWN.immediately
  );
  const isSaving = requestState === REQUEST_STATE.pending;
  const isOn = (chosenViewMode ?? currentAccount.viewMode) === viewMode;
  const isCompact = viewMode === VIEW_MODE.parent;
  const icon = VIEW_MODE_SWITCH_COPY.icon[viewMode];
  const label = VIEW_MODE_SWITCH_COPY.label[viewMode];
  const childNote = viewMode === VIEW_MODE.child && (
    <Note>{VIEW_MODE_SWITCH_COPY.childNote(currentAccount.name)}</Note>
  );
  const chooseThisViewMode = (): void => chooseViewMode(viewMode);

  return (
    <div>
      <Row
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={isSaving}
        data-compact={isCompact}
        data-testid={VIEW_MODE_SWITCH_TEST_IDS.switch}
        onClick={chooseThisViewMode}
      >
        <Icon aria-hidden>{icon}</Icon>
        <Label>
          {label}
          {childNote}
        </Label>
        <Track data-on={isOn} />
      </Row>
      <ViewModeSaveError requestState={requestState} />
    </div>
  );
}
