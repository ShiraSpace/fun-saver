import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { MENU_LABEL_STYLE } from './constants';

const sheetText = ({ theme }: { theme: Theme }): string =>
  theme.colors.softText;

const labelSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.label;

export const Label = styled.div`
  margin: ${MENU_LABEL_STYLE.marginTop}px 2px ${MENU_LABEL_STYLE.marginBottom}px;
  text-align: start;
  font-size: ${labelSize}px;
  font-weight: 700;
  letter-spacing: ${MENU_LABEL_STYLE.letterSpacing}px;
  text-transform: uppercase;
  color: ${sheetText};
`;
