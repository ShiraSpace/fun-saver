'use client';

import { JSX, ReactNode } from 'react';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { ActionButton } from '@/components/ActionButton';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { NameField } from './NameField';
import { FormHeader } from './FormHeader';
import { ACCOUNT_FORM_COPY, ACCOUNT_FORM_TEST_IDS } from './constants';
import { Form, SaveError } from './AccountForm.styles';
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

  const saveError = form.saveFailed ? (
    <SaveError data-testid={ACCOUNT_FORM_TEST_IDS.saveError}>
      {ACCOUNT_FORM_COPY.saveError}
    </SaveError>
  ) : null;

  return (
    <Screen align="top" data-testid={testId}>
      <Form onSubmit={(event): void => void form.handleSubmit(event)}>
        <FormHeader title={title} titleIcon={titleIcon} onCancel={onCancel} />
        <NameField
          value={form.name}
          onChange={form.setName}
          maxLength={MAX_ACCOUNT_NAME_LENGTH}
        />
        <AvatarPicker
          selectedId={form.selectedAvatarId}
          onSelect={form.setSelectedAvatarId}
        />
        <ActionButton
          type="submit"
          disabled={!form.canSubmit}
          data-testid={ACCOUNT_FORM_TEST_IDS.submit}
        >
          {submitLabel}
        </ActionButton>
        {saveError}
      </Form>
    </Screen>
  );
}
