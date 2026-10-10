import { useEffect, useRef } from 'react';
import { DRAWER_HISTORY_KEY } from './constants';

function isDrawerEntry(state: Record<string, unknown> | null): boolean {
  return state?.[DRAWER_HISTORY_KEY] === true;
}

export function useCloseOnBack(onClose: () => void): void {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    window.history.pushState({ [DRAWER_HISTORY_KEY]: true }, '');

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
