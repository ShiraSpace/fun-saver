import { JSX } from 'react';
import {
  EDIT_ACCOUNT_BUTTON_CONTENT,
  EDIT_ACCOUNT_BUTTON_TEST_IDS,
} from './constants';
import { EditButton, EditLabel } from './EditAccountButton.styles';

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
    data-testid={EDIT_ACCOUNT_BUTTON_TEST_IDS.button}
    onClick={onEditAccount}
  >
    <span aria-hidden="true">{EDIT_ACCOUNT_BUTTON_CONTENT.icon}</span>
    <EditLabel>
      {EDIT_ACCOUNT_BUTTON_CONTENT.label} {accountName}
    </EditLabel>
  </EditButton>
);
