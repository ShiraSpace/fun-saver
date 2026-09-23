'use client';

import { JSX } from 'react';
import { Column } from '@/components/Screen';
import { BurgerIcon } from '@/components/Menu/BurgerIcon';
import { ProgressLine } from '@/components/Header/ProgressLine';
import { LOADING_SHELL_CONTENT, LOADING_SHELL_TEST_IDS } from './constants';
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
      aria-label={LOADING_SHELL_CONTENT.label}
      data-testid={LOADING_SHELL_TEST_IDS.shell}
    >
      <Column>
        <Card data-testid={LOADING_SHELL_TEST_IDS.card} aria-hidden>
          <BurgerSlot>
            <BurgerIcon isOpen={false} />
          </BurgerSlot>
          <GhostTitle />
          <GhostAvatar />
          <ProgressLine />
        </Card>
      </Column>
    </Surface>
  );
}
