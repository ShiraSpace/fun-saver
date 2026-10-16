import { JSX } from 'react';
import { Money } from '@/components/Money';
import { STILL_TO_SAVE_COPY, STILL_TO_SAVE_TEST_IDS } from './constants';

interface StillToSaveProps {
  stillToSave: number;
  cheer?: string;
}

export function StillToSave({
  stillToSave,
  cheer = STILL_TO_SAVE_COPY.after,
}: StillToSaveProps): JSX.Element {
  const amount = (
    <Money amountAgorot={stillToSave} testId={STILL_TO_SAVE_TEST_IDS.amount} fullSizeCurrency />
  );

  return (
    <>
      {STILL_TO_SAVE_COPY.before} {amount} {cheer}
    </>
  );
}
