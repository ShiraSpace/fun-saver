'use client';

import { JSX, useState } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { ActionButton } from '@/components/ActionButton';
import { TYPE_SCALE } from '@/theme/typography';
import { NameField } from './NameField';
import { CREATE_ACCOUNT_COPY, CREATE_ACCOUNT_TEST_IDS } from './constants';

const titleColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

const Title = styled.h1`
  margin-top: ${14}px;
  font-size: ${TYPE_SCALE.h2}px;
  font-weight: 700;
  color: ${titleColor};
`;

export function CreateAccount(): JSX.Element {
  const [name, setName] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  const canSubmit = name.trim() !== '' && selectedAvatarId !== null;

  return (
    <Screen align="top" data-testid={CREATE_ACCOUNT_TEST_IDS.container}>
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
    </Screen>
  );
}
