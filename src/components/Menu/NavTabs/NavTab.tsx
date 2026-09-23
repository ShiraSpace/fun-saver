'use client';

import { JSX } from 'react';
import { MenuScreen } from './constants';
import { CurrentTab, InertTab, Tab, TabIcon } from './NavTabs.styles';

interface NavTabProps {
  screen: MenuScreen;
  isCurrent: boolean;
  onNavigate: () => void;
}

export function NavTab({
  screen,
  isCurrent,
  onNavigate,
}: NavTabProps): JSX.Element {
  const face = (
    <>
      <TabIcon aria-hidden>{screen.icon}</TabIcon>
      {screen.label}
    </>
  );

  if (isCurrent) {
    return (
      <CurrentTab data-testid={screen.testId} aria-current="page">
        {face}
      </CurrentTab>
    );
  }

  if (!screen.href) {
    return (
      <InertTab type="button" data-testid={screen.testId} disabled>
        {face}
      </InertTab>
    );
  }

  return (
    <Tab data-testid={screen.testId} href={screen.href} onClick={onNavigate}>
      {face}
    </Tab>
  );
}
