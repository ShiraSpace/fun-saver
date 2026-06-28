'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { EditRow } from './EditRow';
import {
  AMOUNT_PAD_STYLE,
  AMOUNT_PAD_TEST_IDS,
  DIGIT_KEYS_WITHOUT_ZERO,
} from './constants';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${AMOUNT_PAD_STYLE.gap}px;
`;

const Key = styled.button`
  border: none;
  border-radius: ${AMOUNT_PAD_STYLE.radius}px;
  background: ${({ theme }): string => theme.colors.surface};
  color: ${({ theme }): string => theme.colors.textStrong};
  font-family: inherit;
  font-size: ${({ theme }): number => theme.typography.title}px;
  font-weight: 600;
  padding: ${AMOUNT_PAD_STYLE.keyPaddingY}px 0;
  cursor: pointer;
  box-shadow: ${AMOUNT_PAD_STYLE.shadow};
  transition:
    transform ${AMOUNT_PAD_STYLE.pressMs}ms ease,
    box-shadow ${AMOUNT_PAD_STYLE.pressMs}ms ease;

  &:active {
    transform: translateY(${AMOUNT_PAD_STYLE.pressDrop}px);
    box-shadow: none;
  }
`;

const ZeroKey = styled(Key)`
  grid-column: 1 / -1;
`;

interface AmountPadProps {
  onDigit: (digit: number) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export function AmountPad({
  onDigit,
  onClear,
  onBackspace,
}: AmountPadProps): JSX.Element {
  const digitKeys = DIGIT_KEYS_WITHOUT_ZERO.map((digit: string) => (
    <Key
      key={digit}
      type="button"
      data-testid={AMOUNT_PAD_TEST_IDS.key(digit)}
      onClick={(): void => onDigit(Number(digit))}
    >
      {digit}
    </Key>
  ));

  return (
    <>
      <EditRow onClear={onClear} onBackspace={onBackspace} />
      <Grid dir="ltr">
        {digitKeys}
        <ZeroKey
          type="button"
          data-testid={AMOUNT_PAD_TEST_IDS.key('0')}
          onClick={(): void => onDigit(0)}
        >
          0
        </ZeroKey>
      </Grid>
    </>
  );
}
