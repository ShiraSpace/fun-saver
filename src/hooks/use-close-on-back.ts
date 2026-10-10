import { useEffect, useRef } from 'react';
import { newId } from '@/lib/ids';
import { DRAWER_HISTORY_KEY } from './constants';

let pendingBack: ReturnType<typeof setTimeout> | undefined;

function drawerEntryId(
  state: Record<string, unknown> | null
): string | undefined {
  const entryId = state?.[DRAWER_HISTORY_KEY];

  return typeof entryId === 'string' ? entryId : undefined;
}

function addDrawerEntry(entryId: string): void {
  if (pendingBack === undefined) {
    window.history.pushState({ [DRAWER_HISTORY_KEY]: entryId }, '');
    return;
  }

  clearTimeout(pendingBack);
  pendingBack = undefined;
  window.history.replaceState({ [DRAWER_HISTORY_KEY]: entryId }, '');
}

function removeDrawerEntry(): void {
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
    const entryId = newId();
    addDrawerEntry(entryId);

    const handlePopState = (event: PopStateEvent): void => {
      if (drawerEntryId(event.state) !== entryId) {
        onCloseRef.current();
      }
    };
    window.addEventListener('popstate', handlePopState);

    return (): void => {
      window.removeEventListener('popstate', handlePopState);

      if (drawerEntryId(window.history.state) === entryId) {
        removeDrawerEntry();
      }
    };
  }, []);
}
