'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { HOME_ROUTE } from '@/components/Home/constants';
import { GOOGLE_PROVIDER_ID } from './constants';

interface GoogleSignIn {
  requestState: RequestState;
  continueWithGoogle: () => Promise<void>;
}

export function useGoogleSignIn(): GoogleSignIn {
  const [requestState, setRequestState] = useState<RequestState>(
    REQUEST_STATE.idle
  );

  const continueWithGoogle = async (): Promise<void> => {
    setRequestState(REQUEST_STATE.pending);

    try {
      await signIn(GOOGLE_PROVIDER_ID, { redirectTo: HOME_ROUTE });
    } catch {
      setRequestState(REQUEST_STATE.failed);
    }
  };

  return { requestState, continueWithGoogle };
}
