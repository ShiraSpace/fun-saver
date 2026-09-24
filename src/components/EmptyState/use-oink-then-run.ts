'use client';

import { useState } from 'react';

interface OinkThenRun {
  isOinking: boolean;
  onCreateAccountClick: () => void;
  onPigDoneOinking: () => void;
}

export function useOinkThenRun(onDone: () => void): OinkThenRun {
  const [isOinking, setIsOinking] = useState(false);

  return {
    isOinking,
    onCreateAccountClick: (): void => setIsOinking(true),
    onPigDoneOinking: (): void => onDone(),
  };
}
