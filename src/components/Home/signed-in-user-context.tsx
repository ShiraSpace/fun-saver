'use client';

import { createContext, JSX, ReactNode, useContext, useEffect } from 'react';
import { THEME_COOKIE, writeCookie } from '@/lib/cookies';
import { useThemeId } from '@/theme/ThemeController';
import type { SignedInUser } from '@/lib/types';

const NO_PROVIDER = 'useSignedInUser needs a SignedInUserProvider above it';

const SignedInUserContext = createContext<SignedInUser | null>(null);

interface SignedInUserProviderProps {
  value: SignedInUser;
  children: ReactNode;
}

export function SignedInUserProvider({
  value,
  children,
}: SignedInUserProviderProps): JSX.Element {
  const themeId = useThemeId();

  useEffect((): void => {
    writeCookie(THEME_COOKIE, themeId);
  }, [themeId]);

  return (
    <SignedInUserContext.Provider value={value}>
      {children}
    </SignedInUserContext.Provider>
  );
}

export function useSignedInUser(): SignedInUser {
  const value = useContext(SignedInUserContext);

  if (!value) {
    throw new Error(NO_PROVIDER);
  }

  return value;
}
