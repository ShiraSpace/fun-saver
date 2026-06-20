import { JSX } from 'react';
import { Header } from '@/components/Header';

interface AccountProps {
  name: string;
  avatarId: string;
}

export function Account({ name, avatarId }: AccountProps): JSX.Element {
  return <Header name={name} avatarId={avatarId} />;
}
