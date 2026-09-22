import type { AccountEdits } from './types';
import type { CreateAccountInput } from './accounts-store';
import { AVATARS } from './avatars';
import { MAX_ACCOUNT_NAME_LENGTH } from './constants';
import { asObject } from './json-object';

const ACCOUNT_FIELDS = ['name', 'avatarId'] as const;

function hasOnlyAccountFields(body: Record<string, unknown>): boolean {
  return Object.keys(body).every((field) =>
    ACCOUNT_FIELDS.some((editable) => editable === field)
  );
}

function isValidName({ name }: Record<string, unknown>): boolean {
  if (name === undefined) {
    return true;
  }

  return (
    typeof name === 'string' &&
    name.trim() !== '' &&
    name.trim().length <= MAX_ACCOUNT_NAME_LENGTH
  );
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
    !hasOnlyAccountFields(requested) ||
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
