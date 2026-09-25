export type AuthProvider = 'google';

export interface User {
  id: string;
  provider: AuthProvider;
  providerAccountId: string;
  email: string;
  name: string;
  createdAt: string;
}

export type SignedInUser = Pick<User, 'id' | 'name' | 'email'> & {
  image?: string;
};
