'use client';

import { JSX } from 'react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { CHOOSE_BUTTON_COPY, CHOOSE_BUTTON_TEST_IDS } from './constants';

interface ChooseButtonProps {
  onChoose: () => void;
}

export function ChooseButton({ onChoose }: ChooseButtonProps): JSX.Element {
  return (
    <PrimaryButton
      type="button"
      data-testid={CHOOSE_BUTTON_TEST_IDS.button}
      onClick={onChoose}
    >
      {CHOOSE_BUTTON_COPY.choose}
    </PrimaryButton>
  );
}
