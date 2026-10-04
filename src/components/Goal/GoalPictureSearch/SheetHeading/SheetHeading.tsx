'use client';

import { JSX } from 'react';
import { SHEET_HEADING_COPY, SHEET_HEADING_TEST_IDS } from './constants';
import { CloseButton, SheetTitle, TitleRow } from './SheetHeading.styles';

interface SheetHeadingProps {
  titleId: string;
  onClose: () => void;
}

export function SheetHeading({
  titleId,
  onClose,
}: SheetHeadingProps): JSX.Element {
  return (
    <TitleRow>
      <SheetTitle id={titleId} data-testid={SHEET_HEADING_TEST_IDS.title}>
        {SHEET_HEADING_COPY.title}
      </SheetTitle>
      <CloseButton
        type="button"
        aria-label={SHEET_HEADING_COPY.closeLabel}
        data-testid={SHEET_HEADING_TEST_IDS.close}
        onClick={onClose}
      >
        {SHEET_HEADING_COPY.close}
      </CloseButton>
    </TitleRow>
  );
}
