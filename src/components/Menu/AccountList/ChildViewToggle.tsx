'use client';

import { JSX } from 'react';
import { ACCOUNT_LIST_COPY, ACCOUNT_LIST_TEST_IDS } from './constants';
import { ToggleButton } from './AccountList.styles';
import { Track } from '../switch-parts';

interface ChildViewToggleProps {
  accountName: string;
  isShownToChild: boolean;
  isSaving: boolean;
  onToggle: () => void;
}

export function ChildViewToggle({
  accountName,
  isShownToChild,
  isSaving,
  onToggle,
}: ChildViewToggleProps): JSX.Element {
  return (
    <ToggleButton
      type="button"
      role="switch"
      aria-checked={isShownToChild}
      aria-label={ACCOUNT_LIST_COPY.childViewToggleLabel(accountName)}
      disabled={isSaving}
      data-testid={ACCOUNT_LIST_TEST_IDS.childViewToggle}
      onClick={onToggle}
    >
      <Track data-on={isShownToChild} />
    </ToggleButton>
  );
}
