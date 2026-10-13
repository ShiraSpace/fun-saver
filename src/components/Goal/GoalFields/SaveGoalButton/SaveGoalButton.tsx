import { JSX } from 'react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { SAVE_GOAL_BUTTON_COPY, SAVE_GOAL_BUTTON_TEST_IDS } from './constants';
import { SaveError, SavingBar, SubmitButton } from './SaveGoalButton.styles';

interface SaveGoalButtonProps {
  submitLabel: string;
  requestState: RequestState;
}

export function SaveGoalButton({ submitLabel, requestState }: SaveGoalButtonProps): JSX.Element {
  const isRequestPending = requestState === REQUEST_STATE.pending;
  const buttonLabel = isRequestPending ? SAVE_GOAL_BUTTON_COPY.saving : submitLabel;
  const savingBar = isRequestPending && (
    <SavingBar data-testid={SAVE_GOAL_BUTTON_TEST_IDS.loader} />
  );
  const saveError = requestState === REQUEST_STATE.failed && (
    <SaveError data-testid={SAVE_GOAL_BUTTON_TEST_IDS.saveError}>
      {SAVE_GOAL_BUTTON_COPY.saveError}
    </SaveError>
  );

  return (
    <>
      <SubmitButton
        type="submit"
        disabled={isRequestPending}
        aria-busy={isRequestPending}
        data-testid={SAVE_GOAL_BUTTON_TEST_IDS.submit}
      >
        {buttonLabel}
        {savingBar}
      </SubmitButton>
      {saveError}
    </>
  );
}
