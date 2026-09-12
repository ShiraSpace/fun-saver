'use client';

import { FormEvent, JSX, ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { ActionButton } from '@/components/ActionButton';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { NameField } from './NameField';
import {
  ACCOUNT_FORM_COPY,
  ACCOUNT_FORM_LAYOUT,
  ACCOUNT_FORM_TEST_IDS,
} from './constants';

const titleColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;
const titleSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.title;
const backSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.heading;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${ACCOUNT_FORM_LAYOUT.gap}px;
  padding-top: ${ACCOUNT_FORM_LAYOUT.gap}px;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: ${ACCOUNT_FORM_LAYOUT.titleGap}px;
  margin: 0;
  font-size: ${titleSize}px;
  font-weight: 700;
  color: ${titleColor};
`;

const TitleIcon = styled.span`
  font-size: ${titleSize}px;
  line-height: 1;
`;

const SaveError = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${titleColor};
`;

const CloseButton = styled.button`
  position: absolute;
  inset-block-start: ${ACCOUNT_FORM_LAYOUT.closeInset}px;
  inset-inline-start: ${ACCOUNT_FORM_LAYOUT.closeInset}px;
  width: ${ACCOUNT_FORM_LAYOUT.closeButtonSize}px;
  height: ${ACCOUNT_FORM_LAYOUT.closeButtonSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  font-size: ${backSize}px;
  font-weight: 700;
  color: ${titleColor};
  cursor: pointer;
`;

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
