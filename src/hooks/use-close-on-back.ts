import { useEffect, useRef } from 'react';
import { DRAWER_HISTORY_KEY } from './constants';

let pendingBack: ReturnType<typeof setTimeout> | undefined;

let modalsOpened = 0;

const openModalIds: string[] = [];

function nextModalId(): string {
  modalsOpened += 1;

  return `${Date.now()}-${modalsOpened}`;
}

function isTopModal(modalId: string | undefined): boolean {
  return modalId !== undefined && openModalIds.at(-1) === modalId;
}

function ownsCurrentEntry(modalId: string): boolean {
  return window.history.state?.[DRAWER_HISTORY_KEY] === modalId;
}

function takeHistoryEntry(modalId: string): void {
  const entry = { [DRAWER_HISTORY_KEY]: modalId };

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

export function useCloseOnBack(onClose: () => void): () => boolean {
  const onCloseRef = useRef(onClose);
  const modalIdRef = useRef<string>(undefined);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const modalId = nextModalId();
    modalIdRef.current = modalId;
    takeHistoryEntry(modalId);
    openModalIds.push(modalId);

    const handlePopState = (): void => {
      if (!isTopModal(modalId) || ownsCurrentEntry(modalId)) {
        return;
      }

      window.history.pushState({ [DRAWER_HISTORY_KEY]: modalId }, '');
      onCloseRef.current();
    };

    window.addEventListener('popstate', handlePopState);

    return (): void => {
      window.removeEventListener('popstate', handlePopState);
      openModalIds.splice(openModalIds.indexOf(modalId), 1);
      releaseHistoryEntry(modalId);
    };
  }, []);

  return (): boolean => isTopModal(modalIdRef.current);
}
