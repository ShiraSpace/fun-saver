import type { Account } from '@/lib/types';

export const ACCOUNT: Account = {
  id: 'a1',
  name: 'נועה',
  avatarId: 'kid-01',
  isActive: true,
};

export const CREATE_ACCOUNT_INPUT = {
  name: ACCOUNT.name,
  avatarId: ACCOUNT.avatarId,
};
