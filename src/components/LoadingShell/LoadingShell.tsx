'use client';

import { JSX } from 'react';
import { Column } from '@/components/Screen';
import { BurgerIcon } from '@/components/Menu/BurgerIcon';
import { NavigationProgress } from '@/components/Header/NavigationProgress';
import { LOADING_SHELL_COPY, LOADING_SHELL_TEST_IDS } from './constants';
import {
  BurgerSlot,
  Card,
  GhostAvatar,
  GhostTitle,
  Surface,
} from './LoadingShell.styles';

export function LoadingShell(): JSX.Element {
  return (
    <Surface
      role="status"
      aria-label={LOADING_SHELL_COPY.label}
      data-testid={LOADING_SHELL_TEST_IDS.shell}
    >
      <Column>
        <Card data-testid={LOADING_SHELL_TEST_IDS.card} aria-hidden>
          <BurgerSlot>
            <BurgerIcon isOpen={false} />
          </BurgerSlot>
          <GhostTitle />
          <GhostAvatar />
          <NavigationProgress />
        </Card>
      </Column>
    </Surface>
  );
}
