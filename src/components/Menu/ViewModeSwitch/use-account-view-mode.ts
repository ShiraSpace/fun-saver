import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAccounts,
  type ViewModeChoice,
} from '@/components/Home/accounts-context';
import type { AppViewMode } from '@/lib/account/view-mode';
import { fetchJson } from '@/lib/fetch-json';
import { motionIsReduced } from '@/theme/motion';
import { useMenu, useOnMenuClose } from '../use-menu-state';
import { MENU_OVERLAY_STYLE } from '../MenuOverlay/constants';
import { VIEW_MODE_SWITCH_MOTION } from './constants';

interface AccountViewMode {
  chooseViewMode: (viewMode: AppViewMode) => void;
  chosenViewMode?: AppViewMode;
  saveFailed: boolean;
}

interface SavedViewModeSteps {
  closeMenu: () => void;
  refresh: () => void;
  viewModeChoice?: ViewModeChoice;
}

function accountViewModeEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}/view-mode`;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function switchFinishesSliding(): Promise<void> {
  return wait(motionIsReduced() ? 0 : VIEW_MODE_SWITCH_MOTION.slideMs);
}

function menuFinishesFading(): Promise<void> {
  return wait(MENU_OVERLAY_STYLE.transitionMs);
}

function saveSucceeds(saved: Promise<unknown>): Promise<boolean> {
  return saved.then(
    (): boolean => true,
    (): boolean => false
  );
}

async function showSavedViewMode(
  steps: SavedViewModeSteps,
  viewMode: AppViewMode
): Promise<void> {
  steps.closeMenu();

  if (steps.viewModeChoice) {
    await menuFinishesFading();
    steps.viewModeChoice.showViewMode(viewMode);
  }

  steps.refresh();
}

export function useAccountViewMode(): AccountViewMode {
  const { currentAccount, viewModeChoice } = useAccounts();
  const { closeMenu } = useMenu();
  const router = useRouter();
  const [chosenViewMode, setChosenViewMode] = useState<AppViewMode>();
  const [saveFailed, setSaveFailed] = useState(false);

  useOnMenuClose((): void => setSaveFailed(false));

  const chooseViewMode = async (viewMode: AppViewMode): Promise<void> => {
    setChosenViewMode(viewMode);
    setSaveFailed(false);

    const saved = fetchJson({
      url: accountViewModeEndpoint(currentAccount.id),
      method: 'PUT',
      body: { viewMode },
    });
    const [isSaved] = await Promise.all([
      saveSucceeds(saved),
      switchFinishesSliding(),
    ]);

    if (!isSaved) {
      setChosenViewMode(undefined);
      setSaveFailed(true);
      return;
    }

    const refresh = (): void => router.refresh();
    await showSavedViewMode({ closeMenu, refresh, viewModeChoice }, viewMode);
  };

  return {
    chooseViewMode: (viewMode): void => void chooseViewMode(viewMode),
    chosenViewMode,
    saveFailed,
  };
}
