'use client';

import { createContext, useContext } from 'react';
import type { SignedInUser } from '@/lib/types';

const NO_PROVIDER = 'useSignedInUser needs a SignedInUserProvider above it';

const SignedInUserContext = createContext<SignedInUser | null>(null);

export const SignedInUserProvider = SignedInUserContext.Provider;

export function useSignedInUser(): SignedInUser {
  const value = useContext(SignedInUserContext);

  if (!value) {
    throw new Error(NO_PROVIDER);
  }

  return value;
}
