'use client';

import { useSyncExternalStore } from 'react';
import { createRequiredContext } from '@/hooks/create-required-context';
import { readCookie, VIEW_MODE_COOKIE, writeCookie } from '@/lib/cookies';
import { resolveViewMode, type ViewMode } from '@/lib/view-mode';

interface ViewModeValue {
  viewMode: ViewMode;
  chooseViewMode: (viewMode: ViewMode) => void;
}

const [ViewModeProvider, useViewModeOnServer] =
  createRequiredContext<ViewMode>('ViewModeProvider');

export { ViewModeProvider };

const viewModeSubscribers = new Set<() => void>();

function subscribeToViewMode(onViewModeChange: () => void): () => void {
  viewModeSubscribers.add(onViewModeChange);
  window.addEventListener('pageshow', onViewModeChange);
  document.addEventListener('visibilitychange', onViewModeChange);

  return (): void => {
    viewModeSubscribers.delete(onViewModeChange);
    window.removeEventListener('pageshow', onViewModeChange);
    document.removeEventListener('visibilitychange', onViewModeChange);
  };
}

function viewModeOnThisPhone(): ViewMode {
  return resolveViewMode(readCookie(VIEW_MODE_COOKIE));
}

function chooseViewMode(viewMode: ViewMode): void {
  writeCookie(VIEW_MODE_COOKIE, viewMode);
  viewModeSubscribers.forEach((onViewModeChange) => onViewModeChange());
}

export function useViewMode(): ViewModeValue {
  const viewModeOnServer = useViewModeOnServer();
  const viewMode = useSyncExternalStore(
    subscribeToViewMode,
    viewModeOnThisPhone,
    (): ViewMode => viewModeOnServer
  );

  return { viewMode, chooseViewMode };
}
