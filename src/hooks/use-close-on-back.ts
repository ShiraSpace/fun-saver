import { useEffect, useRef } from 'react';

interface HistoryEntryState {
  funsaverDrawer?: boolean;
}

function isDrawerEntry(state: HistoryEntryState | null): boolean {
  return state?.funsaverDrawer === true;
}

export function useCloseOnBack(onClose: () => void): void {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    window.history.pushState({ funsaverDrawer: true }, '');

    const handlePopState = (event: PopStateEvent): void => {
      if (!isDrawerEntry(event.state)) {
        onCloseRef.current();
      }
    };
    window.addEventListener('popstate', handlePopState);

    return (): void => {
      window.removeEventListener('popstate', handlePopState);

      if (isDrawerEntry(window.history.state)) {
        window.history.back();
      }
    };
  }, []);
}
