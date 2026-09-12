'use client';

import { JSX } from 'react';
import { IconBox } from './BurgerIcon.styles';

export interface BurgerIconProps {
  isOpen: boolean;
  testId?: string;
}

export function BurgerIcon({ isOpen, testId }: BurgerIconProps): JSX.Element {
  return (
    <IconBox data-open={isOpen} data-testid={testId}>
      <span />
      <span />
      <span />
    </IconBox>
  );
}
