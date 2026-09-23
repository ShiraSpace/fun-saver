'use client';

import { JSX, ReactNode } from 'react';
import { SignedInUserProvider } from '@/components/Home/signed-in-user-context';
import type { SignedInUser } from '@/lib/types';

interface SignedInProvidersProps {
  user: SignedInUser;
  children: ReactNode;
}

export function SignedInProviders({
  user,
  children,
}: SignedInProvidersProps): JSX.Element {
  return <SignedInUserProvider value={user}>{children}</SignedInUserProvider>;
}
