import type { AccountEdits } from './types';
import type { CreateAccountInput } from './accounts-store';
import { AVATARS } from './avatars';
import { MAX_ACCOUNT_NAME_LENGTH } from './constants';
import { asObject, hasOnlyFields } from '@/lib/json-object';
import { isNameWithin } from '@/lib/name';

const ACCOUNT_FIELDS = ['name', 'avatarId'] as const;

function isValidName({ name }: Record<string, unknown>): boolean {
  if (name === undefined) {
    return true;
  }

  return isNameWithin(name, MAX_ACCOUNT_NAME_LENGTH);
}

function isValidAvatar({ avatarId }: Record<string, unknown>): boolean {
  return (
    avatarId === undefined || AVATARS.some((avatar) => avatar.id === avatarId)
  );
}

function collectEdits(body: Record<string, unknown>): AccountEdits {
  return {
    ...(body.name !== undefined && { name: String(body.name).trim() }),
    ...(body.avatarId !== undefined && { avatarId: String(body.avatarId) }),
  };
}

function validFields(body: unknown): AccountEdits | undefined {
  const requested = asObject(body);

  if (
    !requested ||
    !hasOnlyFields(requested, ACCOUNT_FIELDS) ||
    !isValidName(requested) ||
    !isValidAvatar(requested)
  ) {
    return;
  }

  return collectEdits(requested);
}

export function validAccountEdits(body: unknown): AccountEdits | undefined {
  const edits = validFields(body);

  if (!edits || Object.keys(edits).length === 0) {
    return;
  }

  return edits;
}

export function validNewAccount(body: unknown): CreateAccountInput | undefined {
  const fields = validFields(body);

  if (fields?.name === undefined || fields.avatarId === undefined) {
    return;
  }

  return { name: fields.name, avatarId: fields.avatarId };
}
