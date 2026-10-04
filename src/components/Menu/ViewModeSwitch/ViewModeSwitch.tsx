'use client';

import { JSX } from 'react';
import { useAccounts } from '@/components/Home/accounts-context';
import { APP_VIEW_MODE, type AppViewMode } from '@/lib/account/view-mode';
import { useAccountViewMode } from './use-account-view-mode';
import { VIEW_MODE_SWITCH_COPY, VIEW_MODE_SWITCH_TEST_IDS } from './constants';
import {
  Icon,
  Label,
  Note,
  Row,
  SaveError,
  Track,
} from './ViewModeSwitch.styles';

interface ViewModeSwitchProps {
  viewMode: AppViewMode;
}

export function ViewModeSwitch({ viewMode }: ViewModeSwitchProps): JSX.Element {
  const { currentAccount } = useAccounts();
  const { chooseViewMode, chosenViewMode, saveFailed } = useAccountViewMode();
  const isOn = (chosenViewMode ?? currentAccount.viewMode) === viewMode;

  return (
    <div>
      <Row
        type="button"
        role="switch"
        aria-checked={isOn}
        data-compact={viewMode === APP_VIEW_MODE.parent}
        data-testid={VIEW_MODE_SWITCH_TEST_IDS.switch}
        onClick={(): void => chooseViewMode(viewMode)}
      >
        <Icon aria-hidden>{VIEW_MODE_SWITCH_COPY.icon[viewMode]}</Icon>
        <Label>
          {VIEW_MODE_SWITCH_COPY.label[viewMode]}
          {viewMode === APP_VIEW_MODE.child && (
            <Note>{VIEW_MODE_SWITCH_COPY.childNote(currentAccount.name)}</Note>
          )}
        </Label>
        <Track data-on={isOn} />
      </Row>
      {saveFailed && (
        <SaveError data-testid={VIEW_MODE_SWITCH_TEST_IDS.saveError}>
          {VIEW_MODE_SWITCH_COPY.saveError}
        </SaveError>
      )}
    </div>
  );
}
