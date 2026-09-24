'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LOGIN_PATH } from '@/lib/constants';
import { goTo } from '@/lib/navigate';
import { useOnMenuClose } from '../use-menu-state';

export const SIGN_OUT_STATUS = {
  idle: 'idle',
  signingOut: 'signingOut',
  failed: 'failed',
} as const;

export type SignOutStatus =
  (typeof SIGN_OUT_STATUS)[keyof typeof SIGN_OUT_STATUS];

interface AccountSignOut {
  signOutStatus: SignOutStatus;
  signOutOfAccount: () => Promise<void>;
}

function landsOnLogin(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  return new URL(url, window.location.origin).pathname === LOGIN_PATH;
}

export function useSignOut(): AccountSignOut {
  const [signOutStatus, setSignOutStatus] = useState<SignOutStatus>(
    SIGN_OUT_STATUS.idle
  );

  useOnMenuClose((): void =>
    setSignOutStatus((current) =>
      current === SIGN_OUT_STATUS.failed ? SIGN_OUT_STATUS.idle : current
    )
  );

  const signOutOfAccount = async (): Promise<void> => {
    setSignOutStatus(SIGN_OUT_STATUS.signingOut);

    try {
      const ended = await signOut({
        redirect: false,
        redirectTo: LOGIN_PATH,
      });

      if (!landsOnLogin(ended?.url)) {
        setSignOutStatus(SIGN_OUT_STATUS.failed);
        return;
      }

      goTo(LOGIN_PATH);
    } catch {
      setSignOutStatus(SIGN_OUT_STATUS.failed);
    }
  };

  return { signOutStatus, signOutOfAccount };
}
