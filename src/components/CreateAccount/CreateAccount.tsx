'use client';

import { FormEvent, JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { ActionButton } from '@/components/ActionButton';
import { TYPE_SCALE } from '@/theme/typography';
import { NameField } from './NameField';
import { useCreateAccount } from './use-create-account';
import {
  CREATE_ACCOUNT_COPY,
  CREATE_ACCOUNT_LAYOUT,
  CREATE_ACCOUNT_TEST_IDS,
} from './constants';

const titleColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

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
  font-size: ${TYPE_SCALE.h2}px;
  font-weight: 700;
  color: ${titleColor};
`;

export function CreateAccount(): JSX.Element {
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
    void createAccount({ name, avatarId: selectedAvatarId }).then(() =>
      router.push('/')
    );
  };

  return (
    <Screen align="top" data-testid={CREATE_ACCOUNT_TEST_IDS.container}>
      <Form onSubmit={handleSubmit}>
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
