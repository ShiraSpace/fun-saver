'use client';

import { createContext, useContext } from 'react';

export const APP_MODE = {
  viewing: 'viewing',
  creatingAccount: 'creatingAccount',
  editingAccount: 'editingAccount',
  viewingGoal: 'viewingGoal',
  settingGoal: 'settingGoal',
  cancellingGoal: 'cancellingGoal',
} as const;

export type AppMode = (typeof APP_MODE)[keyof typeof APP_MODE];

export const MODES_SHOWING_THE_GOAL: readonly AppMode[] = [
  APP_MODE.viewingGoal,
  APP_MODE.cancellingGoal,
];

export interface AppModeContextValue {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const AppModeContext = createContext<AppModeContextValue>({
  mode: APP_MODE.viewing,
  setMode: () => {},
});

export const AppModeProvider = AppModeContext.Provider;

export function useAppMode(): AppModeContextValue {
  return useContext(AppModeContext);
}
