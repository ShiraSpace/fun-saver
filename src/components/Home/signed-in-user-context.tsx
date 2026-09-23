'use client';

import { JSX, ReactNode, useEffect } from 'react';
import { createRequiredContext } from '@/hooks/create-required-context';
import { THEME_COOKIE, writeCookie } from '@/lib/cookies';
import { useThemeId } from '@/theme/AppThemeProvider';
import type { SignedInUser } from '@/lib/types';

const [SignedInUserContextProvider, useSignedInUser] =
  createRequiredContext<SignedInUser>('SignedInUserProvider');

export { useSignedInUser };

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
    <SignedInUserContextProvider value={value}>
      {children}
    </SignedInUserContextProvider>
  );
}
