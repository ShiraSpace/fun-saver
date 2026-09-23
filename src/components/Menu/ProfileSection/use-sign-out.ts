'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LOGIN_PATH } from '@/lib/constants';

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

export function useSignOut(): AccountSignOut {
  const [status, setStatus] = useState<SignOutStatus>(SIGN_OUT_STATUS.idle);

  const signOutOfAccount = async (): Promise<void> => {
    setStatus(SIGN_OUT_STATUS.signingOut);

    try {
      await signOut({ redirectTo: LOGIN_PATH });
    } catch {
      setStatus(SIGN_OUT_STATUS.failed);
    }
  };

  return { status, signOutOfAccount };
}
