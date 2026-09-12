'use client';

import { FormEvent, JSX, ReactNode, useState } from 'react';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { ActionButton } from '@/components/ActionButton';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { NameField } from './NameField';
import { ACCOUNT_FORM_COPY, ACCOUNT_FORM_TEST_IDS } from './constants';
import {
  Form,
  Title,
  TitleIcon,
  SaveError,
  CloseButton,
} from './AccountForm.styles';

export interface AccountFormValues {
  name: string;
  avatarId: string;
}

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
  const [name, setName] = useState(initialName);
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId);
  const [saveFailed, setSaveFailed] = useState(false);

  const canSubmit = name.trim() !== '' && selectedAvatarId !== null;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (selectedAvatarId === null) {
      return;
    }

    setSaveFailed(false);

    try {
      await onSubmit({ name: name.trim(), avatarId: selectedAvatarId });
    } catch {
      setSaveFailed(true);
    }
  };

  const icon = titleIcon ? (
    <TitleIcon aria-hidden="true" data-testid={ACCOUNT_FORM_TEST_IDS.titleIcon}>
      {titleIcon}
    </TitleIcon>
  ) : null;

  const saveError = saveFailed ? (
    <SaveError data-testid={ACCOUNT_FORM_TEST_IDS.saveError}>
      {ACCOUNT_FORM_COPY.saveError}
    </SaveError>
  ) : null;

  const cancelButton = onCancel ? (
    <CloseButton
      type="button"
      aria-label={ACCOUNT_FORM_COPY.cancelLabel}
      onClick={onCancel}
      data-testid={ACCOUNT_FORM_TEST_IDS.cancel}
    >
      {ACCOUNT_FORM_COPY.cancel}
    </CloseButton>
  ) : null;

  return (
    <Screen align="top" data-testid={testId}>
      <Form onSubmit={(event): void => void handleSubmit(event)}>
        {cancelButton}
        <Title data-testid={ACCOUNT_FORM_TEST_IDS.title}>
          {icon}
          {title}
        </Title>
        <NameField
          value={name}
          onChange={setName}
          maxLength={MAX_ACCOUNT_NAME_LENGTH}
        />
        <AvatarPicker
          selectedId={selectedAvatarId}
          onSelect={setSelectedAvatarId}
        />
        <ActionButton
          type="submit"
          disabled={!canSubmit}
          data-testid={ACCOUNT_FORM_TEST_IDS.submit}
        >
          {submitLabel}
        </ActionButton>
        {saveError}
      </Form>
    </Screen>
  );
}
