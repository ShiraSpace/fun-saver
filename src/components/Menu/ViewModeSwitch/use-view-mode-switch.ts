import { useState } from 'react';
import { useViewMode } from '@/components/Home/view-mode-context';
import type { ViewMode } from '@/lib/account/view-mode';
import { wait } from '@/lib/wait';
import { motionIsReduced } from '@/theme/motion';
import { useMenu } from '../use-menu-state';
import { MENU_OVERLAY_STYLE } from '../MenuOverlay/constants';
import { VIEW_MODE_SWITCH_MOTION } from './constants';

interface ViewModeSwitchState {
  shownViewMode: ViewMode;
  switchViewMode: (viewMode: ViewMode) => void;
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

  const slideThenChoose = async (nextViewMode: ViewMode): Promise<void> => {
    setChosenViewMode(nextViewMode);
    await switchFinishesSliding();
    closeMenu();
    await menuFinishesFading();
    chooseViewMode(nextViewMode);
  };

  return {
    shownViewMode: chosenViewMode ?? viewMode,
    switchViewMode: (nextViewMode: ViewMode): void => {
      void slideThenChoose(nextViewMode);
    },
  };
}
