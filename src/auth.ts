import NextAuth, { type Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Google from 'next-auth/providers/google';
import { getStore } from '@/db';
import { provisionUser, googleIdentity, type GoogleIdentity } from '@/lib/user/user-provisioning';
import { sessionUser } from '@/lib/user/session-user';
import type { SignedInUser } from '@/lib/user/types';

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    identity?: GoogleIdentity;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ profile }): Promise<boolean> {
      return Boolean(googleIdentity(profile));
    },

    async jwt({ token, profile }): Promise<JWT> {
      const identity = googleIdentity(profile) ?? token.identity;

      if (identity) {
        const user = await provisionUser(getStore(), identity);
        token.userId = user.id;
        token.identity = identityKeptForDevelopment(identity);
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

function identityKeptForDevelopment(identity: GoogleIdentity): GoogleIdentity | undefined {
  return process.env.NODE_ENV === 'development' ? identity : undefined;
}

export async function signedInUser(): Promise<SignedInUser | undefined> {
  return sessionUser(await auth());
}
