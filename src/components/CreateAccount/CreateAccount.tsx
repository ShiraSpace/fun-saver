'use client';

import { JSX } from 'react';
import { useRouter } from 'next/navigation';
import type { Account } from '@/lib/types';
import { AccountForm } from '@/components/AccountForm';
import type { AccountFormValues } from '@/components/AccountForm/AccountForm';
import { useCreateAccount } from './use-create-account';
import { CREATE_ACCOUNT_COPY, CREATE_ACCOUNT_TEST_IDS } from './constants';

interface CreateAccountProps {
  onCreated?: (account: Account) => void;
  onCancel?: () => void;
}

export function CreateAccount({
  onCreated,
  onCancel,
}: CreateAccountProps): JSX.Element {
  const router = useRouter();
  const { createAccount } = useCreateAccount();

  const handleSubmit = async (values: AccountFormValues): Promise<void> => {
    const account = await createAccount(values);

    if (onCreated) {
      onCreated(account);
      return;
    }

    router.push('/');
  };

  return (
    <AccountForm
      data-testid={CREATE_ACCOUNT_TEST_IDS.container}
      title={CREATE_ACCOUNT_COPY.title}
      titleIcon={CREATE_ACCOUNT_COPY.titleIcon}
      submitLabel={CREATE_ACCOUNT_COPY.submit}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
