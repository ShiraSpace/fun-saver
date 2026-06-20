import { JSX } from 'react';
import { Header } from '@/components/Header';

const PLACEHOLDER_ACCOUNT = { name: 'יעל', avatarId: 'kid-01' };

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen">
      <Header
        name={PLACEHOLDER_ACCOUNT.name}
        avatarId={PLACEHOLDER_ACCOUNT.avatarId}
      />
    </main>
  );
}
