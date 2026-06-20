import { JSX } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Header } from '@/components/Header';
import { getStore } from '@/db';

export const dynamic = 'force-dynamic';

export default async function Home(): Promise<JSX.Element> {
  const [account] = await getStore().listAccounts();

  const mainComponent = account ? (
    <Header name={account.name} avatarId={account.avatarId} />
  ) : (
    <EmptyState />
  );

  return <main>{mainComponent}</main>;
}
