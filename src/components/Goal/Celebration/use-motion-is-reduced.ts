'use client';

import { useSyncExternalStore } from 'react';
import { motionIsReduced } from '@/theme/motion';

const ignoreChanges = (): (() => void) => (): void => {};

const reducedOnServer = (): boolean => true;

export function useMotionIsReduced(): boolean {
  return useSyncExternalStore(ignoreChanges, motionIsReduced, reducedOnServer);
}
