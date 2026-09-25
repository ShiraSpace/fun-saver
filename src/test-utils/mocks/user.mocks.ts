import type { User } from '@/lib/user/types';

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'u1',
    provider: 'google',
    providerAccountId: 'google-sub-1',
    email: 'eli@example.com',
    name: 'אלי',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export const mockUser: User = createMockUser();

export const mockCoParent: User = createMockUser({
  id: 'u2',
  providerAccountId: 'google-sub-2',
  email: 'mushit@example.com',
  name: 'מושית',
});
