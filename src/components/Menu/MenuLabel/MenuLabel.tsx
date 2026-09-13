'use client';

import { JSX, ReactNode } from 'react';
import { Label } from './MenuLabel.styles';

export interface MenuLabelProps {
  children: ReactNode;
}

export function MenuLabel({ children }: MenuLabelProps): JSX.Element {
  return <Label>{children}</Label>;
}
