'use client';

import { JSX } from 'react';
import type { Account } from '@/lib/types';
import { AccountForm } from '@/components/AccountForm';
import type { AccountFormValues } from '@/components/AccountForm/AccountForm';
import { useUpdateAccount } from './use-update-account';
import { EDIT_ACCOUNT_COPY, EDIT_ACCOUNT_TEST_IDS } from './constants';

interface EditAccountProps {
  account: Account;
  onUpdated: () => void;
  onCancel: () => void;
}

export function EditAccount({
  account,
  onUpdated,
  onCancel,
}: EditAccountProps): JSX.Element {
  const { updateAccount } = useUpdateAccount();

  const handleSubmit = (values: AccountFormValues): void => {
    void updateAccount(account.id, values).then(onUpdated);
  };

  return (
    <AccountForm
      data-testid={EDIT_ACCOUNT_TEST_IDS.container}
      title={EDIT_ACCOUNT_COPY.title}
      titleIcon={EDIT_ACCOUNT_COPY.titleIcon}
      submitLabel={EDIT_ACCOUNT_COPY.submit}
      initialName={account.name}
      initialAvatarId={account.avatarId}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
