import { JSX } from 'react';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from '@/components/Menu/AccountsSection/constants';
import { ActionChip } from '@/components/Menu/AccountsSection/AccountsSection';

interface AddAccountChipProps {
  onAddAccount: () => void;
}

export const AddAccountChip = ({
  onAddAccount,
}: AddAccountChipProps): JSX.Element => (
  <ActionChip
    type="button"
    aria-label={ACCOUNTS_SECTION_CONTENT.addLabel}
    data-testid={ACCOUNTS_SECTION_TEST_IDS.addChip}
    onClick={onAddAccount}
  >
    {ACCOUNTS_SECTION_CONTENT.addIcon}
  </ActionChip>
);
