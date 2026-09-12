import type { AccountEdits } from './types';
import { AVATARS } from './avatars';
import { MAX_ACCOUNT_NAME_LENGTH } from './constants';

const EDITABLE_FIELDS = ['name', 'avatarId'] as const;

function asEditsObject(body: unknown): Record<string, unknown> | undefined {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return;
  }

  return body as Record<string, unknown>;
}

function hasOnlyEditableFields(body: Record<string, unknown>): boolean {
  return Object.keys(body).every((field) =>
    EDITABLE_FIELDS.some((editable) => editable === field)
  );
}

function isValidRename({ name }: Record<string, unknown>): boolean {
  if (name === undefined) {
    return true;
  }

  return (
    typeof name === 'string' &&
    name.trim() !== '' &&
    name.trim().length <= MAX_ACCOUNT_NAME_LENGTH
  );
}

function isValidAvatarChange({ avatarId }: Record<string, unknown>): boolean {
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

export function validAccountEdits(body: unknown): AccountEdits | undefined {
  const requested = asEditsObject(body);

  if (
    !requested ||
    !hasOnlyEditableFields(requested) ||
    !isValidRename(requested) ||
    !isValidAvatarChange(requested)
  ) {
    return;
  }

  const edits = collectEdits(requested);

  if (Object.keys(edits).length === 0) {
    return;
  }

  return edits;
}
