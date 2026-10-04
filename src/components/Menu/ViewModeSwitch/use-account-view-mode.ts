import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAccounts,
  type ViewModeChoice,
} from '@/components/Home/accounts-context';
import type { ViewMode } from '@/lib/account/view-mode';
import { fetchJson } from '@/lib/fetch-json';
import { wait } from '@/lib/wait';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { motionIsReduced } from '@/theme/motion';
import { useReportPendingNavigation } from '@/components/Header/navigation-pending-context';
import { useMenu, useOnMenuClose } from '../use-menu-state';
import { MENU_OVERLAY_STYLE } from '../MenuOverlay/constants';
import { VIEW_MODE_SWITCH_MOTION } from './constants';

interface AccountViewMode {
  chooseViewMode: (viewMode: ViewMode) => void;
  chosenViewMode?: ViewMode;
  requestState: RequestState;
}

interface SavedViewModeSteps {
  closeMenu: () => void;
  refresh: () => void;
  viewModeChoice?: ViewModeChoice;
}

function accountViewModeEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}/view-mode`;
}

function switchFinishesSliding(): Promise<void> {
  return wait(motionIsReduced() ? 0 : VIEW_MODE_SWITCH_MOTION.slideMs);
}

function menuFinishesFading(): Promise<void> {
  return wait(MENU_OVERLAY_STYLE.transitionMs);
}

async function showSavedViewMode(
  steps: SavedViewModeSteps,
  viewMode: ViewMode
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
  const [chosenViewMode, setChosenViewMode] = useState<ViewMode>();
  const [requestState, setRequestState] = useState<RequestState>(
    REQUEST_STATE.idle
  );

  const isSaving = requestState === REQUEST_STATE.pending;

  useReportPendingNavigation(isSaving);
  useOnMenuClose((): void =>
    setRequestState((current) =>
      current === REQUEST_STATE.failed ? REQUEST_STATE.idle : current
    )
  );

  const saveAndShowViewMode = async (viewMode: ViewMode): Promise<void> => {
    setChosenViewMode(viewMode);
    setRequestState(REQUEST_STATE.pending);

    const saved = fetchJson({
      url: accountViewModeEndpoint(currentAccount.id),
      method: 'PUT',
      body: { viewMode },
    });
    const [save] = await Promise.allSettled([saved, switchFinishesSliding()]);

    if (save.status === 'rejected') {
      setChosenViewMode(undefined);
      setRequestState(REQUEST_STATE.failed);
      return;
    }

    const refresh = (): void => router.refresh();
    await showSavedViewMode({ closeMenu, refresh, viewModeChoice }, viewMode);
  };

  return {
    chooseViewMode: (viewMode: ViewMode): void => {
      void saveAndShowViewMode(viewMode);
    },
    chosenViewMode,
    requestState,
  };
}
