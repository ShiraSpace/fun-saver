import { JSX } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { ACCOUNT_FORM_COPY, ACCOUNT_FORM_TEST_IDS } from './constants';
import { SaveError } from './AccountForm.styles';

interface FormFooterProps {
  submitLabel: string;
  canSubmit: boolean;
  saveFailed: boolean;
}

export function FormFooter({
  submitLabel,
  canSubmit,
  saveFailed,
}: FormFooterProps): JSX.Element {
  const saveError = saveFailed ? (
    <SaveError data-testid={ACCOUNT_FORM_TEST_IDS.saveError}>
      {ACCOUNT_FORM_COPY.saveError}
    </SaveError>
  ) : null;

  return (
    <>
      <ActionButton
        type="submit"
        disabled={!canSubmit}
        data-testid={ACCOUNT_FORM_TEST_IDS.submit}
      >
        {submitLabel}
      </ActionButton>
      {saveError}
    </>
  );
}
