import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ACCOUNT_FORM_LAYOUT } from './constants';

const alertText = ({ theme }: { theme: Theme }): string =>
  theme.colors.alertText;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${ACCOUNT_FORM_LAYOUT.gap}px;
  padding-top: ${ACCOUNT_FORM_LAYOUT.gap}px;
`;

export const SaveError = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${alertText};
`;
