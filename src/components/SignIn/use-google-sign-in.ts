'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { GOOGLE_PROVIDER_ID, SIGNED_IN_DESTINATION } from './constants';

interface GoogleSignIn {
  isSigningIn: boolean;
  hasFailed: boolean;
  continueWithGoogle: () => Promise<void>;
}

export function useGoogleSignIn(): GoogleSignIn {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const continueWithGoogle = async (): Promise<void> => {
    setIsSigningIn(true);
    setHasFailed(false);

    try {
      await signIn(GOOGLE_PROVIDER_ID, { redirectTo: SIGNED_IN_DESTINATION });
    } catch {
      setHasFailed(true);
      setIsSigningIn(false);
    }
  };

  return { isSigningIn, hasFailed, continueWithGoogle };
}
