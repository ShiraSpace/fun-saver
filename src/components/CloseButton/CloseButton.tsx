import { JSX } from 'react';
import { CLOSE_BUTTON_COPY, CLOSE_BUTTON_TEST_IDS } from './constants';
import { Close } from './CloseButton.styles';

interface CloseButtonProps {
  onClose?: () => void;
  disabled?: boolean;
}

export function CloseButton({
  onClose,
  disabled = false,
}: CloseButtonProps): JSX.Element | null {
  if (!onClose) {
    return null;
  }

  return (
    <Close
      type="button"
      aria-label={CLOSE_BUTTON_COPY.label}
      onClick={onClose}
      disabled={disabled}
      data-testid={CLOSE_BUTTON_TEST_IDS.button}
    >
      {CLOSE_BUTTON_COPY.glyph}
    </Close>
  );
}
