import { JSX } from 'react';
import { ACCOUNT_FORM_COPY, ACCOUNT_FORM_TEST_IDS } from './constants';
import { CloseButton } from './AccountForm.styles';

interface CancelButtonProps {
  onCancel?: () => void;
}

export function CancelButton({
  onCancel,
}: CancelButtonProps): JSX.Element | null {
  if (!onCancel) {
    return null;
  }

  return (
    <CloseButton
      type="button"
      aria-label={ACCOUNT_FORM_COPY.cancelLabel}
      onClick={onCancel}
      data-testid={ACCOUNT_FORM_TEST_IDS.cancel}
    >
      {ACCOUNT_FORM_COPY.cancel}
    </CloseButton>
  );
}
