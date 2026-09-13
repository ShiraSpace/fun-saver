import { Dispatch, FormEvent, SetStateAction, useState } from 'react';

export interface AccountFormValues {
  name: string;
  avatarId: string;
}

interface AccountFormOptions {
  initialName: string;
  initialAvatarId: string | null;
  onSubmit: (values: AccountFormValues) => Promise<void> | void;
}

interface EditableAccount {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  selectedAvatarId: string | null;
  setSelectedAvatarId: Dispatch<SetStateAction<string | null>>;
  saveFailed: boolean;
  canSubmit: boolean;
  saveAccount: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useAccountForm({
  initialName,
  initialAvatarId,
  onSubmit,
}: AccountFormOptions): EditableAccount {
  const [name, setName] = useState(initialName);
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId);
  const [saveFailed, setSaveFailed] = useState(false);

  const saveAccount = async (
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

  return {
    name,
    setName,
    selectedAvatarId,
    setSelectedAvatarId,
    saveFailed,
    canSubmit: name.trim() !== '' && selectedAvatarId !== null,
    saveAccount,
  };
}
