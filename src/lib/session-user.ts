import type { Session } from 'next-auth';
import { displayName } from './user-provisioning';
import type { SignedInUser } from './types';

export function sessionUser(session: Session | null): SignedInUser | undefined {
  const user = session?.user;

  if (!user?.id || !user.email) {
    return;
  }

  return {
    id: user.id,
    name: displayName(user.name, user.email),
    email: user.email,
    image: user.image ?? undefined,
  };
}
