'use client';

import { JSX } from 'react';
import { AMOUNT_PAD_COPY, AMOUNT_PAD_TEST_IDS } from '../constants';
import { Row, EditKey, EditIcon } from './EditRow.styles';

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
