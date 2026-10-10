import { useState } from 'react';
import { useViewMode } from '@/components/Home/view-mode-context';
import { VIEW_MODE, type ViewMode } from '@/lib/view-mode';
import { wait } from '@/lib/wait';
import { motionIsReduced } from '@/theme/motion';
import { useReportPendingNavigation } from '@/components/Header/navigation-pending-context';
import { useMenu } from '../use-menu-state';
import { MENU_OVERLAY_STYLE } from '../MenuOverlay/constants';
import { VIEW_MODE_SWITCH_MOTION } from './constants';

interface ViewModeSwitchState {
  shownViewMode: ViewMode;
  isSwitching: boolean;
  switchViewMode: () => void;
}

function otherViewMode(viewMode: ViewMode): ViewMode {
  return viewMode === VIEW_MODE.child ? VIEW_MODE.parent : VIEW_MODE.child;
}

function switchFinishesSliding(): Promise<void> {
  return wait(motionIsReduced() ? 0 : VIEW_MODE_SWITCH_MOTION.slideMs);
}

function menuFinishesFading(): Promise<void> {
  return wait(MENU_OVERLAY_STYLE.transitionMs);
}

export function useViewModeSwitch(): ViewModeSwitchState {
  const { viewMode, chooseViewMode } = useViewMode();
  const { closeMenu } = useMenu();
  const [chosenViewMode, setChosenViewMode] = useState<ViewMode>();
  const isSwitching = chosenViewMode !== undefined;

  useReportPendingNavigation(isSwitching);

  const slideThenChoose = async (nextViewMode: ViewMode): Promise<void> => {
    setChosenViewMode(nextViewMode);
    await switchFinishesSliding();
    closeMenu();
    await menuFinishesFading();
    chooseViewMode(nextViewMode);
    setChosenViewMode(undefined);
  };

  return {
    shownViewMode: chosenViewMode ?? viewMode,
    isSwitching,
    switchViewMode: (): void => {
      void slideThenChoose(otherViewMode(viewMode));
    },
  };
}
