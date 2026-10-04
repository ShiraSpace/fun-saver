import { JSX } from 'react';
import { ACCOUNT_FORM_COPY, ACCOUNT_FORM_TEST_IDS } from './constants';
import { Cancel } from './AccountForm.styles';

interface CancelButtonProps {
  onCancel?: () => void;
  disabled: boolean;
}

export function CancelButton({
  onCancel,
  disabled,
}: CancelButtonProps): JSX.Element | null {
  if (!onCancel) {
    return null;
  }

  return (
    <Cancel
      type="button"
      aria-label={ACCOUNT_FORM_COPY.cancelLabel}
      onClick={onCancel}
      disabled={disabled}
      data-testid={ACCOUNT_FORM_TEST_IDS.cancel}
    >
      {ACCOUNT_FORM_COPY.cancel}
    </Cancel>
  );
}
