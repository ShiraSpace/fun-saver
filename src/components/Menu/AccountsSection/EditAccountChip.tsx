import { JSX } from 'react';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from '@/components/Menu/AccountsSection/constants';
import { ActionChip } from '@/components/Menu/AccountsSection/AccountsSection';

export const EditAccountChip = (): JSX.Element => (
  <ActionChip
    type="button"
    aria-label={ACCOUNTS_SECTION_CONTENT.editLabel}
    data-testid={ACCOUNTS_SECTION_TEST_IDS.editChip}
  >
    {ACCOUNTS_SECTION_CONTENT.editIcon}
  </ActionChip>
);
