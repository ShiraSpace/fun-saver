'use client';

import { useCallback } from 'react';
import { useEscapeKey } from './use-escape-key';

interface EscapeDismissalParams {
  isOpen: boolean;
  onClose: () => void;
  isAccountListOpen: boolean;
  onAccountListToggle: (isOpen: boolean) => void;
}

export function useEscapeDismissal({
  isOpen,
  onClose,
  isAccountListOpen,
  onAccountListToggle,
}: EscapeDismissalParams): void {
  const closePickerThenMenu = useCallback((): void => {
    if (isAccountListOpen) {
      onAccountListToggle(false);
      return;
    }

    onClose();
  }, [isAccountListOpen, onAccountListToggle, onClose]);

  useEscapeKey({ isListening: isOpen, onEscape: closePickerThenMenu });
}
