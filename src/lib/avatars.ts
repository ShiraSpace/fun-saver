export interface AvatarOption {
  id: string;
  background: string;
}

const AVATAR_DIRECTORY = '/avatars';
const AVATAR_EXTENSION = '.svg';

export function avatarSource(id: string): string {
  return `${AVATAR_DIRECTORY}/${id}${AVATAR_EXTENSION}`;
}

export const AVATARS: readonly AvatarOption[] = [
  { id: 'kid-01', background: '#7AB7E0' },
  { id: 'kid-02', background: '#84C98A' },
  { id: 'kid-03', background: '#F2C84B' },
  { id: 'kid-04', background: '#E090B0' },
  { id: 'kid-05', background: '#C79BE0' },
  { id: 'kid-06', background: '#69C2C2' },
  { id: 'kid-07', background: '#E0875F' },
  { id: 'kid-08', background: '#9AA7E0' },
  { id: 'kid-09', background: '#E0B36A' },
  { id: 'kid-10', background: '#7FBF7F' },
  { id: 'kid-11', background: '#E07A8A' },
  { id: 'kid-12', background: '#6FB2E0' },
  { id: 'kid-13', background: '#C9A26A' },
  { id: 'kid-14', background: '#8FD0C0' },
  { id: 'kid-15', background: '#E0A0C8' },
  { id: 'kid-16', background: '#A8C66C' },
  { id: 'kid-17', background: '#F0A868' },
  { id: 'kid-18', background: '#9CC3E0' },
  { id: 'kid-19', background: '#D6A2E0' },
  { id: 'kid-20', background: '#7CC9B0' },
];
