import { JSX } from 'react';
import type { SwipeToClose } from '../use-swipe-to-close';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { Handle } from './DrawerHandle.styles';

interface DrawerHandleProps {
  swipe: SwipeToClose;
}

export function DrawerHandle({ swipe }: DrawerHandleProps): JSX.Element {
  return (
    <Handle
      data-testid={TRANSACTION_DRAWER_TEST_IDS.handle}
      onPointerDown={swipe.onPointerDown}
      onPointerMove={swipe.onPointerMove}
      onPointerUp={swipe.onPointerUp}
    />
  );
}
