'use client';

import { MouseEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OinkThenNavigate {
  isOinking: boolean;
  onCtaClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onPigDoneOinking: () => void;
}

export function useOinkThenNavigate(href: string): OinkThenNavigate {
  const router = useRouter();
  const [isOinking, setIsOinking] = useState(false);

  return {
    isOinking,
    onCtaClick: (event: MouseEvent<HTMLAnchorElement>): void => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.button !== 0
      ) {
        return;
      }
      event.preventDefault();
      setIsOinking(true);
    },
    onPigDoneOinking: (): void => router.push(href),
  };
}
