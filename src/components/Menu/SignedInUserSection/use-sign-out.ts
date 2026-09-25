'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { SIGN_IN_PATH } from '@/lib/user/constants';
import { goTo } from '@/lib/navigate';
import { useOnMenuClose } from '../use-menu-state';

export const SIGN_OUT_STATUS = {
  idle: 'idle',
  signingOut: 'signingOut',
  failed: 'failed',
} as const;

export type SignOutStatus =
  (typeof SIGN_OUT_STATUS)[keyof typeof SIGN_OUT_STATUS];

interface UserSignOut {
  signOutStatus: SignOutStatus;
  signOutUser: () => Promise<void>;
}

function landsOnSignIn(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  return new URL(url, window.location.origin).pathname === SIGN_IN_PATH;
}

export function useSignOut(): UserSignOut {
  const [signOutStatus, setSignOutStatus] = useState<SignOutStatus>(
    SIGN_OUT_STATUS.idle
  );

  useOnMenuClose((): void =>
    setSignOutStatus((current) =>
      current === SIGN_OUT_STATUS.failed ? SIGN_OUT_STATUS.idle : current
    )
  );

  const signOutUser = async (): Promise<void> => {
    setSignOutStatus(SIGN_OUT_STATUS.signingOut);

    try {
      const ended = await signOut({
        redirect: false,
        redirectTo: SIGN_IN_PATH,
      });

      if (!landsOnSignIn(ended?.url)) {
        setSignOutStatus(SIGN_OUT_STATUS.failed);
        return;
      }

      goTo(SIGN_IN_PATH);
    } catch {
      setSignOutStatus(SIGN_OUT_STATUS.failed);
    }
  };

  return { signOutStatus, signOutUser };
}
