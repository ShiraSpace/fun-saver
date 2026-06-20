import type { Metadata } from 'next';
import './globals.css';
import React, { JSX } from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Fun Saver',
  description: 'Your first savings app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="he" dir="rtl">
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
