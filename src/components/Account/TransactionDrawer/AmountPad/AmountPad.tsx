'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import {
  AMOUNT_PAD_COPY,
  AMOUNT_PAD_TEST_IDS,
  DIGIT_KEYS_WITHOUT_ZERO,
} from './constants';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const Key = styled.button`
  border: none;
  border-radius: 14px;
  background: ${({ theme }): string => theme.colors.surface};
  color: ${({ theme }): string => theme.colors.textStrong};
  font-family: inherit;
  font-size: 22px;
  font-weight: 600;
  padding: 13px 0;
  cursor: pointer;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.05);
`;

const ControlKey = styled(Key)`
  color: ${({ theme }): string => theme.colors.textMuted};
  font-size: 18px;
`;

interface AmountPadProps {
  onDigit: (digit: number) => void;
  onClear: () => void;
  onBackspace: () => void;
}

interface PadKey {
  testId: string;
  label: string;
  onClick: () => void;
  control?: boolean;
}

export function AmountPad({
  onDigit,
  onClear,
  onBackspace,
}: AmountPadProps): JSX.Element {
  const allKeysButZero: PadKey[] = DIGIT_KEYS_WITHOUT_ZERO.map(
    (key: string) => ({
      testId: AMOUNT_PAD_TEST_IDS.key(key),
      label: key,
      onClick: (): void => onDigit(Number(key)),
    })
  );
  const clearKey = {
    testId: AMOUNT_PAD_TEST_IDS.clear,
    label: AMOUNT_PAD_COPY.clear,
    onClick: onClear,
    control: true,
  };
  const zeroKey = {
    testId: AMOUNT_PAD_TEST_IDS.key('0'),
    label: '0',
    onClick: (): void => onDigit(0),
  };
  const backspaceKey = {
    testId: AMOUNT_PAD_TEST_IDS.backspace,
    label: AMOUNT_PAD_COPY.backspace,
    onClick: onBackspace,
    control: true,
  };

  const keys: PadKey[] = [...allKeysButZero, clearKey, zeroKey, backspaceKey];

  const keyPadComponents = keys.map(({ testId, label, onClick, control }) => {
    const PadButton = control ? ControlKey : Key;

    return (
      <PadButton
        key={testId}
        type="button"
        data-testid={testId}
        onClick={onClick}
      >
        {label}
      </PadButton>
    );
  });

  return <Grid>{keyPadComponents}</Grid>;
}
