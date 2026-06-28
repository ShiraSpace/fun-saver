'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import {
  AMOUNT_PAD_COPY,
  AMOUNT_PAD_STYLE,
  AMOUNT_PAD_TEST_IDS,
} from '../constants';

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${AMOUNT_PAD_STYLE.gap}px;
  margin-top: ${AMOUNT_PAD_STYLE.topGap}px;
  margin-bottom: ${AMOUNT_PAD_STYLE.gap}px;
`;

const EditKey = styled.button`
  border: none;
  border-radius: ${AMOUNT_PAD_STYLE.radius}px;
  background: ${({ theme }): string => theme.colors.surface};
  color: ${({ theme }): string => theme.colors.textMuted};
  font-family: inherit;
  font-size: ${({ theme }): number => theme.typography.title}px;
  font-weight: 600;
  padding: ${AMOUNT_PAD_STYLE.editPaddingY}px 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: ${AMOUNT_PAD_STYLE.shadow};
  transition:
    transform ${AMOUNT_PAD_STYLE.pressMs}ms ease,
    box-shadow ${AMOUNT_PAD_STYLE.pressMs}ms ease;

  &:active {
    transform: translateY(${AMOUNT_PAD_STYLE.pressDrop}px);
    box-shadow: none;
  }
`;

const EditIcon = styled.span`
  font-size: ${({ theme }): number => theme.typography.title}px;
`;

interface EditRowProps {
  onClear: () => void;
  onBackspace: () => void;
}

export function EditRow({ onClear, onBackspace }: EditRowProps): JSX.Element {
  return (
    <Row>
      <EditKey
        type="button"
        data-testid={AMOUNT_PAD_TEST_IDS.clear}
        onClick={onClear}
      >
        <EditIcon>{AMOUNT_PAD_COPY.clearIcon}</EditIcon>
        {AMOUNT_PAD_COPY.clear}
      </EditKey>
      <EditKey
        type="button"
        data-testid={AMOUNT_PAD_TEST_IDS.backspace}
        onClick={onBackspace}
      >
        <EditIcon>{AMOUNT_PAD_COPY.backspaceIcon}</EditIcon>
        {AMOUNT_PAD_COPY.backspace}
      </EditKey>
    </Row>
  );
}
