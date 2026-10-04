'use client';

import { JSX } from 'react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { VIEW_MODE_SWITCH_COPY, VIEW_MODE_SWITCH_TEST_IDS } from './constants';
import { SaveError } from './ViewModeSaveError.styles';

interface ViewModeSaveErrorProps {
  requestState: RequestState;
}

export function ViewModeSaveError({
  requestState,
}: ViewModeSaveErrorProps): JSX.Element | null {
  if (requestState !== REQUEST_STATE.failed) {
    return null;
  }

  return (
    <SaveError data-testid={VIEW_MODE_SWITCH_TEST_IDS.saveError}>
      {VIEW_MODE_SWITCH_COPY.saveError}
    </SaveError>
  );
}
