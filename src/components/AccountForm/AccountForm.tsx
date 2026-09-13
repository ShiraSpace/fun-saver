'use client';

import { JSX, ReactNode } from 'react';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { NameField } from './NameField';
import { CancelButton } from './CancelButton';
import { FormTitle } from './FormTitle';
import { SaveAccount } from './SaveAccount';
import { Form } from './AccountForm.styles';
import { useAccountForm, type AccountFormValues } from './use-account-form';

export type { AccountFormValues };

interface AccountFormProps {
  title: string;
  titleIcon?: ReactNode;
  submitLabel: string;
  initialName?: string;
  initialAvatarId?: string | null;
  onSubmit: (values: AccountFormValues) => Promise<void> | void;
  onCancel?: () => void;
  'data-testid': string;
}

export function AccountForm({
  title,
  titleIcon,
  submitLabel,
  initialName = '',
  initialAvatarId = null,
  onSubmit,
  onCancel,
  'data-testid': testId,
}: AccountFormProps): JSX.Element {
  const form = useAccountForm({ initialName, initialAvatarId, onSubmit });

  return (
    <Screen align="top" data-testid={testId}>
      <Form onSubmit={(event): void => void form.saveAccount(event)}>
        <CancelButton onCancel={onCancel} />
        <FormTitle title={title} titleIcon={titleIcon} />
        <NameField
          value={form.name}
          onChange={form.setName}
          maxLength={MAX_ACCOUNT_NAME_LENGTH}
        />
        <AvatarPicker
          selectedId={form.selectedAvatarId}
          onSelect={form.setSelectedAvatarId}
        />
        <SaveAccount
          submitLabel={submitLabel}
          canSubmit={form.canSubmit}
          saveFailed={form.saveFailed}
        />
      </Form>
    </Screen>
  );
}
