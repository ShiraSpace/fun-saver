import NextAuth, { type Profile, type Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Google from 'next-auth/providers/google';
import { getStore } from '@/db';
import { GOOGLE_PROVIDER } from '@/lib/constants';
import { provisionUser, type GoogleIdentity } from '@/lib/user-provisioning';

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
  }
}

function toGoogleIdentity(profile?: Profile): GoogleIdentity | undefined {
  const { sub, email, name } = profile ?? {};

  if (!sub || !email || !name) {
    return;
  }

  return { providerAccountId: sub, email, name };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ profile }): Promise<boolean> {
      const identity = toGoogleIdentity(profile);

      if (!identity) {
        return false;
      }

      await provisionUser(getStore(), identity);

      return true;
    },

    async jwt({ token, profile }): Promise<JWT> {
      const identity = toGoogleIdentity(profile);

      if (identity) {
        const user = await getStore().findUserByProvider(
          GOOGLE_PROVIDER,
          identity.providerAccountId
        );
        token.userId = user?.id;
      }

      return token;
    },

    async session({ session, token }): Promise<Session> {
      session.user.id = token.userId ?? session.user.id;

      return session;
    },
  },
});
