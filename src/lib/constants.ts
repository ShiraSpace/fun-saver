import type { AccountUserRole, AuthProvider } from './types';

export const GOOGLE_PROVIDER: AuthProvider = 'google';

export const SIGN_IN_PATH = '/login';

export const EDITING_ROLES: readonly AccountUserRole[] = ['owner', 'editor'];

export const AGOROT_PER_SHEKEL = 100;

export const MAX_ACCOUNT_NAME_LENGTH = 60;
