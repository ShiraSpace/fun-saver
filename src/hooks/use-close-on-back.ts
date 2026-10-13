import { useEffect, useRef } from 'react';
import { DRAWER_HISTORY_KEY } from './constants';

let pendingBack: ReturnType<typeof setTimeout> | undefined;

let modalsOpened = 0;

function nextModalId(): string {
  modalsOpened += 1;

  return `${Date.now()}-${modalsOpened}`;
}

function historyEntry(modalId: string): Record<string, string> {
  return { [DRAWER_HISTORY_KEY]: modalId };
}

function ownsCurrentEntry(modalId: string): boolean {
  return window.history.state?.[DRAWER_HISTORY_KEY] === modalId;
}

function takeHistoryEntry(modalId: string): void {
  const entry = historyEntry(modalId);

  if (pendingBack === undefined) {
    window.history.pushState(entry, '');
  } else {
    window.history.replaceState(entry, '');
  }

  clearTimeout(pendingBack);
  pendingBack = undefined;
}

function releaseHistoryEntry(modalId: string): void {
  if (!ownsCurrentEntry(modalId)) {
    return;
  }

  pendingBack = setTimeout(() => {
    pendingBack = undefined;
    window.history.back();
  });
}

export function useCloseOnBack(onClose: () => void): void {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const modalId = nextModalId();
    takeHistoryEntry(modalId);

    const handlePopState = (): void => {
      if (ownsCurrentEntry(modalId)) {
        return;
      }

      window.history.pushState(historyEntry(modalId), '');
      onCloseRef.current();
    };

    window.addEventListener('popstate', handlePopState);

    return (): void => {
      window.removeEventListener('popstate', handlePopState);
      releaseHistoryEntry(modalId);
    };
  }, []);
}
