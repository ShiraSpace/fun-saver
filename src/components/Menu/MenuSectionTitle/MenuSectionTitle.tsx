'use client';

import { JSX, ReactNode } from 'react';
import { Label } from './MenuSectionTitle.styles';

export interface MenuSectionTitleProps {
  children: ReactNode;
}

export function MenuSectionTitle({
  children,
}: MenuSectionTitleProps): JSX.Element {
  return <Label>{children}</Label>;
}
