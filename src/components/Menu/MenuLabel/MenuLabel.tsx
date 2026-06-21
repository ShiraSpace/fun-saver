'use client';

import { JSX, ReactNode } from 'react';
import styled from '@emotion/styled';
import { MENU_LABEL_STYLE } from './constants';

const Label = styled.div`
  margin: ${MENU_LABEL_STYLE.marginTop}px 2px ${MENU_LABEL_STYLE.marginBottom}px;
  text-align: start;
  font-size: ${MENU_LABEL_STYLE.fontSize}px;
  font-weight: 700;
  letter-spacing: ${MENU_LABEL_STYLE.letterSpacing}px;
  text-transform: uppercase;
  opacity: ${MENU_LABEL_STYLE.opacity};
`;

export interface MenuLabelProps {
  children: ReactNode;
}

export function MenuLabel({ children }: MenuLabelProps): JSX.Element {
  return <Label>{children}</Label>;
}
