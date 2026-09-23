'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LOGIN_PATH } from '@/lib/constants';

interface AccountSignOut {
  hasSignOutFailed: boolean;
  signOutOfAccount: () => Promise<void>;
}

export function useSignOut(): AccountSignOut {
  const [hasSignOutFailed, setHasSignOutFailed] = useState(false);

  const signOutOfAccount = async (): Promise<void> => {
    setHasSignOutFailed(false);

    try {
      await signOut({ redirectTo: LOGIN_PATH });
    } catch {
      setHasSignOutFailed(true);
    }
  };

  return { hasSignOutFailed, signOutOfAccount };
}
