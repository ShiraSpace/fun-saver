import { useEffect, useRef } from 'react';
import { DRAWER_HISTORY_KEY } from './constants';

let pendingBack: ReturnType<typeof setTimeout> | undefined;

export function useCloseOnBack(onClose: () => void): void {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (pendingBack === undefined) {
      window.history.pushState({ [DRAWER_HISTORY_KEY]: true }, '');
    }
    clearTimeout(pendingBack);
    pendingBack = undefined;

    const handlePopState = (): void => onCloseRef.current();
    window.addEventListener('popstate', handlePopState);

    return (): void => {
      window.removeEventListener('popstate', handlePopState);

      if (window.history.state?.[DRAWER_HISTORY_KEY]) {
        pendingBack = setTimeout(() => {
          pendingBack = undefined;
          window.history.back();
        });
      }
    };
  }, []);
}
