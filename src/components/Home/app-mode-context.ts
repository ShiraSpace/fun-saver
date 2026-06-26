'use client';

import { createContext, useContext } from 'react';

export const APP_MODE = {
  viewing: 'viewing',
  creatingAccount: 'creatingAccount',
} as const;

export type AppMode = (typeof APP_MODE)[keyof typeof APP_MODE];

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
