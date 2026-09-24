import { JSX } from 'react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ACCOUNT_FORM_COPY, ACCOUNT_FORM_TEST_IDS } from './constants';
import { SaveError } from './AccountForm.styles';

interface SaveAccountProps {
  submitLabel: string;
  canSubmit: boolean;
  saveFailed: boolean;
}

export function SaveAccountButton({
  submitLabel,
  canSubmit,
  saveFailed,
}: SaveAccountProps): JSX.Element {
  const saveError = saveFailed ? (
    <SaveError data-testid={ACCOUNT_FORM_TEST_IDS.saveError}>
      {ACCOUNT_FORM_COPY.saveError}
    </SaveError>
  ) : null;

  return (
    <>
      <PrimaryButton
        type="submit"
        disabled={!canSubmit}
        data-testid={ACCOUNT_FORM_TEST_IDS.submit}
      >
        {submitLabel}
      </PrimaryButton>
      {saveError}
    </>
  );
}
