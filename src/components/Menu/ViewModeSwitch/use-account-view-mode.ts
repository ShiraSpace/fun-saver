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

interface ViewModeSwitchSteps {
  saved: Promise<unknown>;
  closeMenu: () => void;
  refresh: () => void;
  slideBack: () => void;
  reportSaveFailed: (saveFailed: boolean) => void;
}

function accountViewModeEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}/view-mode`;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function switchFinishesSliding(): Promise<void> {
  return wait(motionIsReduced() ? 0 : VIEW_MODE_SWITCH_MOTION.slideMs);
}

function menuFinishesFading(): Promise<void> {
  return wait(MENU_OVERLAY_STYLE.transitionMs);
}

function saveSucceeds(saved: Promise<unknown>): Promise<boolean> {
  return saved.then(
    () => true,
    () => false
  );
}

async function showThenSave(
  steps: ViewModeSwitchSteps,
  viewModeChoice: ViewModeChoice,
  viewMode: AppViewMode
): Promise<void> {
  const isSaved = saveSucceeds(steps.saved);

  await switchFinishesSliding();
  steps.closeMenu();
  await menuFinishesFading();
  viewModeChoice.showViewMode(viewMode);

  if (await isSaved) {
    steps.refresh();
    return;
  }

  viewModeChoice.returnToSavedViewMode();
  steps.reportSaveFailed(true);
}

async function saveThenShow(steps: ViewModeSwitchSteps): Promise<void> {
  const [isSaved] = await Promise.all([
    saveSucceeds(steps.saved),
    switchFinishesSliding(),
  ]);

  if (isSaved) {
    steps.closeMenu();
    steps.refresh();
    return;
  }

  steps.slideBack();
  steps.reportSaveFailed(true);
}

export function useAccountViewMode(): AccountViewMode {
  const { currentAccount, viewModeChoice } = useAccounts();
  const { closeMenu } = useMenu();
  const router = useRouter();
  const [chosenViewMode, setChosenViewMode] = useState<AppViewMode>();
  const [localSaveFailed, setLocalSaveFailed] = useState(false);
  const reportSaveFailed =
    viewModeChoice?.reportSaveFailed ?? setLocalSaveFailed;

  useOnMenuClose((): void => reportSaveFailed(false));

  const chooseViewMode = (viewMode: AppViewMode): void => {
    setChosenViewMode(viewMode);
    reportSaveFailed(false);

    const steps: ViewModeSwitchSteps = {
      saved: fetchJson({
        url: accountViewModeEndpoint(currentAccount.id),
        method: 'PUT',
        body: { viewMode },
      }),
      closeMenu,
      refresh: (): void => router.refresh(),
      slideBack: (): void => setChosenViewMode(undefined),
      reportSaveFailed,
    };

    void (viewModeChoice
      ? showThenSave(steps, viewModeChoice, viewMode)
      : saveThenShow(steps));
  };

  return {
    chooseViewMode,
    chosenViewMode,
    saveFailed: viewModeChoice?.saveFailed ?? localSaveFailed,
  };
}
