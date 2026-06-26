'use client';

import { FormEvent, JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { Account } from '@/lib/types';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { ActionButton } from '@/components/ActionButton';
import { NameField } from './NameField';
import { useCreateAccount } from './use-create-account';
import {
  CREATE_ACCOUNT_COPY,
  CREATE_ACCOUNT_LAYOUT,
  CREATE_ACCOUNT_TEST_IDS,
} from './constants';

const titleColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;
const titleSize = ({ theme }: { theme: Theme }): number => theme.typography.h2;
const backSize = ({ theme }: { theme: Theme }): number => theme.typography.h3;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${CREATE_ACCOUNT_LAYOUT.gap}px;
  padding-top: ${CREATE_ACCOUNT_LAYOUT.gap}px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${titleSize}px;
  font-weight: 700;
  color: ${titleColor};
`;

const CloseButton = styled.button`
  align-self: flex-start;
  margin-inline-start: ${CREATE_ACCOUNT_LAYOUT.closeInset}px;
  width: ${CREATE_ACCOUNT_LAYOUT.closeButtonSize}px;
  height: ${CREATE_ACCOUNT_LAYOUT.closeButtonSize}px;
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
  const [name, setName] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  const canSubmit = name.trim() !== '' && selectedAvatarId !== null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (selectedAvatarId === null) {
      return;
    }
    void createAccount({ name, avatarId: selectedAvatarId }).then((account) => {
      if (onCreated) {
        onCreated(account);
        return;
      }
      router.push('/');
    });
  };

  return (
    <Screen align="top" data-testid={CREATE_ACCOUNT_TEST_IDS.container}>
      <Form onSubmit={handleSubmit}>
        {onCancel && (
          <CloseButton
            type="button"
            aria-label={CREATE_ACCOUNT_COPY.cancelLabel}
            onClick={onCancel}
            data-testid={CREATE_ACCOUNT_TEST_IDS.cancel}
          >
            {CREATE_ACCOUNT_COPY.cancel}
          </CloseButton>
        )}
        <Title data-testid={CREATE_ACCOUNT_TEST_IDS.title}>
          {CREATE_ACCOUNT_COPY.title}
        </Title>
        <NameField value={name} onChange={setName} />
        <AvatarPicker
          selectedId={selectedAvatarId}
          onSelect={setSelectedAvatarId}
        />
        <ActionButton
          type="submit"
          disabled={!canSubmit}
          data-testid={CREATE_ACCOUNT_TEST_IDS.submit}
        >
          {CREATE_ACCOUNT_COPY.submit}
        </ActionButton>
      </Form>
    </Screen>
  );
}
