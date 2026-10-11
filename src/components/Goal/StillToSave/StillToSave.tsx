import { JSX } from 'react';
import { Money } from '@/components/Money';
import { STILL_TO_SAVE_COPY, STILL_TO_SAVE_TEST_IDS } from './constants';

interface StillToSaveProps {
  stillToSave: number;
}

export function StillToSave({ stillToSave }: StillToSaveProps): JSX.Element {
  return (
    <>
      {STILL_TO_SAVE_COPY.before}{' '}
      <Money
        amountAgorot={stillToSave}
        testId={STILL_TO_SAVE_TEST_IDS.amount}
        fullSizeCurrency
      />{' '}
      {STILL_TO_SAVE_COPY.after}
    </>
  );
}
