import NextAuth, { type Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Google from 'next-auth/providers/google';
import { getStore } from '@/db';
import { provisionUser, googleIdentity } from '@/lib/user-provisioning';
import { sessionUser } from '@/lib/session-user';
import type { SignedInUser } from '@/lib/types';

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ profile }): Promise<boolean> {
      return Boolean(googleIdentity(profile));
    },

    async jwt({ token, profile }): Promise<JWT> {
      const identity = googleIdentity(profile);

      if (identity) {
        const user = await provisionUser(getStore(), identity);
        token.userId = user.id;
      }

      return token;
    },

    async session({ session, token }): Promise<Session> {
      if (token.userId) {
        session.user.id = token.userId;
      }

      return session;
    },
  },
});

export async function signedInUser(): Promise<SignedInUser | undefined> {
  return sessionUser(await auth());
}
