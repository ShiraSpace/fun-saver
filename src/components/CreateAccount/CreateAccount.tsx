'use client';

import { JSX, useState } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { TYPE_SCALE } from '@/theme/typography';
import { CREATE_ACCOUNT_COPY, CREATE_ACCOUNT_TEST_IDS } from './constants';

const titleColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

const Title = styled.h1`
  margin: 0;
  font-size: ${TYPE_SCALE.h2}px;
  font-weight: 700;
  color: ${titleColor};
`;

export function CreateAccount(): JSX.Element {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  return (
    <Screen data-testid={CREATE_ACCOUNT_TEST_IDS.container}>
      <Title data-testid={CREATE_ACCOUNT_TEST_IDS.title}>
        {CREATE_ACCOUNT_COPY.title}
      </Title>
      <label data-testid={CREATE_ACCOUNT_TEST_IDS.nameField}>
        <span data-testid={CREATE_ACCOUNT_TEST_IDS.nameLabel}>
          {CREATE_ACCOUNT_COPY.nameLabel}
        </span>
        <input data-testid={CREATE_ACCOUNT_TEST_IDS.nameInput} />
      </label>
      <AvatarPicker
        selectedId={selectedAvatarId}
        onSelect={setSelectedAvatarId}
      />
    </Screen>
  );
}
