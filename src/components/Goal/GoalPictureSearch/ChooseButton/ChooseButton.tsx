'use client';

import { JSX } from 'react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { CHOOSE_BUTTON_COPY, CHOOSE_BUTTON_TEST_IDS } from './constants';

interface ChooseButtonProps {
  onConfirm: () => void;
}

export function ChooseButton({ onConfirm }: ChooseButtonProps): JSX.Element {
  return (
    <PrimaryButton
      type="button"
      data-testid={CHOOSE_BUTTON_TEST_IDS.button}
      onClick={onConfirm}
    >
      {CHOOSE_BUTTON_COPY.choose}
    </PrimaryButton>
  );
}
