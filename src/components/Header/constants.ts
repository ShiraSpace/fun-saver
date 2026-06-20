export const HEADER_TEST_IDS = {
  bar: 'header',
  name: 'header-name',
  avatar: 'header-avatar',
} as const;

export const HEADER_AVATAR_PROPS = {
  size: 40,
  directory: '/avatars',
  extension: '.svg',
} as const;

export const HEADER_LAYOUT = {
  paddingX: 16,
  paddingY: 12,
} as const;

export function avatarSource(avatarId: string): string {
  return `${HEADER_AVATAR_PROPS.directory}/${avatarId}${HEADER_AVATAR_PROPS.extension}`;
}
