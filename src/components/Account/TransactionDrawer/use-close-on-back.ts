import { useEffect, useRef } from 'react';

export function useCloseOnBack(onClose: () => void): void {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    window.history.pushState({ funsaverDrawer: true }, '');

    const handlePopState = (): void => onCloseRef.current();
    window.addEventListener('popstate', handlePopState);

    return (): void => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
}
