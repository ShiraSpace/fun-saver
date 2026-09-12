import { JSX } from 'react';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from '@/components/Menu/AccountsSection/constants';
import { ActionPill } from '@/components/Menu/AccountsSection/AccountsSection';

interface EditAccountChipProps {
  accountName: string;
  onEditAccount: () => void;
}

export const EditAccountChip = ({
  accountName,
  onEditAccount,
}: EditAccountChipProps): JSX.Element => (
  <ActionPill
    type="button"
    aria-label={`${ACCOUNTS_SECTION_CONTENT.editPrefix} ${accountName}`}
    data-testid={ACCOUNTS_SECTION_TEST_IDS.editChip}
    onClick={onEditAccount}
  >
    <span aria-hidden="true">{ACCOUNTS_SECTION_CONTENT.editIcon}</span>
    {`${ACCOUNTS_SECTION_CONTENT.editPrefix} ${accountName}`}
  </ActionPill>
);
