'use client';

import { JSX } from 'react';
import { PendingNavigationReporter } from '@/components/Header/navigation-pending-context';
import { NavigationDestination } from './constants';
import { CurrentTab, InertTab, Tab, TabIcon } from './NavigationTabs.styles';

interface NavigationTabProps {
  destination: NavigationDestination;
  isCurrent: boolean;
  onNavigate: () => void;
}

export function NavigationTab({
  destination,
  isCurrent,
  onNavigate,
}: NavigationTabProps): JSX.Element {
  const tabContent = (
    <>
      <TabIcon aria-hidden>{destination.icon}</TabIcon>
      {destination.label}
    </>
  );

  if (isCurrent) {
    return (
      <CurrentTab data-testid={destination.testId} aria-current="page">
        {tabContent}
      </CurrentTab>
    );
  }

  if (!destination.href) {
    return (
      <InertTab type="button" data-testid={destination.testId} disabled>
        {tabContent}
      </InertTab>
    );
  }

  return (
    <Tab
      data-testid={destination.testId}
      href={destination.href}
      onClick={onNavigate}
    >
      {tabContent}
      <PendingNavigationReporter />
    </Tab>
  );
}
