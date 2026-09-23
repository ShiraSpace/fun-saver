'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LOGIN_PATH } from '@/lib/constants';
import { goTo } from '@/lib/navigate';

export const SIGN_OUT_STATUS = {
  idle: 'idle',
  signingOut: 'signingOut',
  failed: 'failed',
} as const;

export type SignOutStatus =
  (typeof SIGN_OUT_STATUS)[keyof typeof SIGN_OUT_STATUS];

interface AccountSignOut {
  status: SignOutStatus;
  signOutOfAccount: () => Promise<void>;
}

function landsOnLogin(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  return new URL(url, window.location.origin).pathname === LOGIN_PATH;
}

export function useSignOut(): AccountSignOut {
  const [status, setStatus] = useState<SignOutStatus>(SIGN_OUT_STATUS.idle);

  const signOutOfAccount = async (): Promise<void> => {
    setStatus(SIGN_OUT_STATUS.signingOut);

    try {
      const ended = await signOut({
        redirect: false,
        redirectTo: LOGIN_PATH,
      });

      if (!landsOnLogin(ended?.url)) {
        setStatus(SIGN_OUT_STATUS.failed);
        return;
      }

      goTo(LOGIN_PATH);
    } catch {
      setStatus(SIGN_OUT_STATUS.failed);
    }
  };

  return { status, signOutOfAccount };
}
