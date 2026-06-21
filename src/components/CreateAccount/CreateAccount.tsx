'use client';

import { JSX, useState } from 'react';
import { Screen } from '@/components/Screen';
import { AvatarPicker } from '@/components/AvatarPicker';
import { CREATE_ACCOUNT_TEST_IDS } from './constants';

export function CreateAccount(): JSX.Element {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  return (
    <Screen data-testid={CREATE_ACCOUNT_TEST_IDS.container}>
      <input data-testid={CREATE_ACCOUNT_TEST_IDS.nameInput} />
      <AvatarPicker
        selectedId={selectedAvatarId}
        onSelect={setSelectedAvatarId}
      />
    </Screen>
  );
}
