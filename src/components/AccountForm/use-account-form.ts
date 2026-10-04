import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';

export interface AccountFormValues {
  name: string;
  avatarId: string;
}

interface AccountFormOptions {
  initialName: string;
  initialAvatarId: string | null;
  onSubmit: (values: AccountFormValues) => Promise<void> | void;
}

interface AccountFormState {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  selectedAvatarId: string | null;
  setSelectedAvatarId: Dispatch<SetStateAction<string | null>>;
  requestState: RequestState;
  canSubmit: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useAccountForm({
  initialName,
  initialAvatarId,
  onSubmit,
}: AccountFormOptions): AccountFormState {
  const [name, setName] = useState(initialName);
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId);
  const [requestState, setRequestState] = useState<RequestState>(
    REQUEST_STATE.idle
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (selectedAvatarId === null) {
      return;
    }

    setRequestState(REQUEST_STATE.pending);

    try {
      await onSubmit({ name: name.trim(), avatarId: selectedAvatarId });
    } catch {
      setRequestState(REQUEST_STATE.failed);
    }
  };

  const canSubmit =
    name.trim() !== '' &&
    selectedAvatarId !== null &&
    requestState !== REQUEST_STATE.pending;

  return {
    name,
    setName,
    selectedAvatarId,
    setSelectedAvatarId,
    requestState,
    canSubmit,
    handleSubmit,
  };
}
