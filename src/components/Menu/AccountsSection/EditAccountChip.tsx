import { JSX } from 'react';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from '@/components/Menu/AccountsSection/constants';
import { ActionChip } from './AccountsSection.styles';

interface EditAccountChipProps {
  onEditAccount: () => void;
}

export const EditAccountChip = ({
  onEditAccount,
}: EditAccountChipProps): JSX.Element => (
  <ActionChip
    type="button"
    aria-label={ACCOUNTS_SECTION_CONTENT.editLabel}
    data-testid={ACCOUNTS_SECTION_TEST_IDS.editChip}
    onClick={onEditAccount}
  >
    {ACCOUNTS_SECTION_CONTENT.editIcon}
  </ActionChip>
);
