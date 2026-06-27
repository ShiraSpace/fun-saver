'use client';

import { useState } from 'react';

interface OinkThenRun {
  isOinking: boolean;
  onCtaClick: () => void;
  onPigDoneOinking: () => void;
}

export function useOinkThenRun(onDone: () => void): OinkThenRun {
  const [isOinking, setIsOinking] = useState(false);

  return {
    isOinking,
    onCtaClick: (): void => setIsOinking(true),
    onPigDoneOinking: (): void => onDone(),
  };
}
