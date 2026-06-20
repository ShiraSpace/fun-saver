'use client';

import { JSX } from 'react';
import { Menu } from '@/components/Menu';

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen p-8">
      <Menu />
    </main>
  );
}
