import { JSX } from 'react';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from './constants';
import { EditButton, EditLabel } from './AccountsSection.styles';

interface EditAccountButtonProps {
  accountName: string;
  onEditAccount: () => void;
}

export const EditAccountButton = ({
  accountName,
  onEditAccount,
}: EditAccountButtonProps): JSX.Element => (
  <EditButton
    type="button"
    data-testid={ACCOUNTS_SECTION_TEST_IDS.editButton}
    onClick={onEditAccount}
  >
    <EditLabel>
      {ACCOUNTS_SECTION_CONTENT.editLabel} {accountName}
    </EditLabel>
    <span aria-hidden="true">{ACCOUNTS_SECTION_CONTENT.editIcon}</span>
  </EditButton>
);
