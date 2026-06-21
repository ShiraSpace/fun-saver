'use client';

import { JSX, useState } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { TYPE_SCALE } from '@/theme/typography';
import {
  CREATE_ACCOUNT_COPY,
  CREATE_ACCOUNT_FIELD,
  CREATE_ACCOUNT_TEST_IDS,
} from './constants';

const titleColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;
const surface = ({ theme }: { theme: Theme }): string => theme.colors.surface;
const labelColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;
const valueColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

const Title = styled.h1`
  margin: 0;
  font-size: ${TYPE_SCALE.h2}px;
  font-weight: 700;
  color: ${titleColor};
`;

const NameField = styled.label`
  display: flex;
  align-items: center;
  gap: ${CREATE_ACCOUNT_FIELD.gap}px;
  width: 100%;
  max-width: ${CREATE_ACCOUNT_FIELD.maxWidth}px;
  padding: ${CREATE_ACCOUNT_FIELD.paddingY}px ${CREATE_ACCOUNT_FIELD.paddingX}px;
  border-radius: ${CREATE_ACCOUNT_FIELD.radius}px;
  background: ${surface};
  box-shadow: ${CREATE_ACCOUNT_FIELD.shadow};
  color: ${labelColor};
`;

const NameInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  font-weight: 700;
  color: ${valueColor};
`;

export function CreateAccount(): JSX.Element {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  return (
    <Screen data-testid={CREATE_ACCOUNT_TEST_IDS.container}>
      <Title data-testid={CREATE_ACCOUNT_TEST_IDS.title}>
        {CREATE_ACCOUNT_COPY.title}
      </Title>
      <NameField data-testid={CREATE_ACCOUNT_TEST_IDS.nameField}>
        <span data-testid={CREATE_ACCOUNT_TEST_IDS.nameLabel}>
          {CREATE_ACCOUNT_COPY.nameLabel}
        </span>
        <NameInput data-testid={CREATE_ACCOUNT_TEST_IDS.nameInput} />
      </NameField>
      <AvatarPicker
        selectedId={selectedAvatarId}
        onSelect={setSelectedAvatarId}
      />
    </Screen>
  );
}
