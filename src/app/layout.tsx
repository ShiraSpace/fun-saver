import type { Metadata } from 'next';
import './globals.css';
import React, { JSX } from 'react';
import { cookies } from 'next/headers';
import { Providers } from './providers';
import { resolveThemeId, THEME_COOKIE } from '@/lib/theme-cookie';

export const metadata: Metadata = {
  title: 'Fun Saver',
  description: 'Your first savings app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  const store = await cookies();
  const initialThemeId = resolveThemeId(store.get(THEME_COOKIE)?.value);

  return (
    <html lang="he" dir="rtl">
      <body className="flex min-h-full flex-col">
        <Providers initialThemeId={initialThemeId}>{children}</Providers>
      </body>
    </html>
  );
}
