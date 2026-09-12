import type { AccountEdits } from './types';
import { AVATARS } from './avatars';

function asRequestedEdits(body: unknown): AccountEdits | undefined {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return;
  }

  return body as AccountEdits;
}

function isValidRename({ name }: AccountEdits): boolean {
  return name === undefined || (typeof name === 'string' && name.trim() !== '');
}

function isValidAvatarChange({ avatarId }: AccountEdits): boolean {
  return (
    avatarId === undefined || AVATARS.some((avatar) => avatar.id === avatarId)
  );
}

function collectEdits({ name, avatarId }: AccountEdits): AccountEdits {
  return {
    ...(name !== undefined && { name: name.trim() }),
    ...(avatarId !== undefined && { avatarId }),
  };
}

export function validAccountEdits(body: unknown): AccountEdits | undefined {
  const requested = asRequestedEdits(body);

  if (
    !requested ||
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
