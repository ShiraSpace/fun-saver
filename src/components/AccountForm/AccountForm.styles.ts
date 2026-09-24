import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ACCOUNT_FORM_LAYOUT } from './constants';

const titleColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

const alertText = ({ theme }: { theme: Theme }): string =>
  theme.colors.alertText;

const film = ({ theme }: { theme: Theme }): string => theme.tints.film;

const titleSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.title;

const backSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.heading;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${ACCOUNT_FORM_LAYOUT.gap}px;
  padding-top: ${ACCOUNT_FORM_LAYOUT.gap}px;
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: ${ACCOUNT_FORM_LAYOUT.titleGap}px;
  margin: 0;
  font-size: ${titleSize}px;
  font-weight: 700;
  color: ${titleColor};
`;

export const TitleIcon = styled.span`
  font-size: ${titleSize}px;
  line-height: 1;
`;

export const SaveError = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${alertText};
`;

export const Cancel = styled.button`
  position: absolute;
  inset-block-start: ${ACCOUNT_FORM_LAYOUT.cancelInset}px;
  inset-inline-start: ${ACCOUNT_FORM_LAYOUT.cancelInset}px;
  width: ${ACCOUNT_FORM_LAYOUT.cancelSize}px;
  height: ${ACCOUNT_FORM_LAYOUT.cancelSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: ${film};
  font-size: ${backSize}px;
  font-weight: 700;
  color: ${titleColor};
  cursor: pointer;
`;
