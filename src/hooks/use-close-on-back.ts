import { useEffect, useRef } from 'react';
import { newId } from '@/lib/ids';
import { DRAWER_HISTORY_KEY } from './constants';

const entriesLeftBehind = new Set<string>();

function drawerEntryId(
  state: Record<string, unknown> | null
): string | undefined {
  const entryId = state?.[DRAWER_HISTORY_KEY];

  return typeof entryId === 'string' ? entryId : undefined;
}

function isLeftBehind(entryId: string | undefined): boolean {
  return entryId !== undefined && entriesLeftBehind.has(entryId);
}

export function useCloseOnBack(onClose: () => void): void {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const entryId = newId();
    window.history.pushState({ [DRAWER_HISTORY_KEY]: entryId }, '');

    const handlePopState = (event: PopStateEvent): void => {
      const landedOn = drawerEntryId(event.state);

      if (landedOn !== entryId && !isLeftBehind(landedOn)) {
        onCloseRef.current();
      }
    };
    window.addEventListener('popstate', handlePopState);

    return (): void => {
      window.removeEventListener('popstate', handlePopState);

      if (drawerEntryId(window.history.state) === entryId) {
        entriesLeftBehind.add(entryId);
        window.history.back();
      }
    };
  }, []);
}
