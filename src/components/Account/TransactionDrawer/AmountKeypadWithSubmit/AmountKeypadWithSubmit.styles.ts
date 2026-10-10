import styled from '@emotion/styled';
import { AMOUNT_KEYPAD_STYLE } from '../AmountKeypad/constants';

export const KeypadSpace = styled.div`
  position: relative;
`;

export const Keypad = styled.div<{ covered: boolean }>`
  visibility: ${({ covered }): string => (covered ? 'hidden' : 'visible')};
`;

export const InPlaceOfKeypad = styled.div`
  position: absolute;
  inset: ${AMOUNT_KEYPAD_STYLE.topGap}px 0
    ${AMOUNT_KEYPAD_STYLE.gridMarginBottom}px;
  display: flex;
  flex-direction: column;
`;
