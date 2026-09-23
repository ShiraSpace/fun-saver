import type { Session } from 'next-auth';
import { toDisplayName } from './user-provisioning';
import type { SignedInUser } from './types';

export function toSignedInUser(
  session: Session | null
): SignedInUser | undefined {
  const user = session?.user;

  if (!user?.id || !user.email) {
    return;
  }

  return {
    id: user.id,
    name: toDisplayName(user.name, user.email),
    email: user.email,
    image: user.image ?? undefined,
  };
}
