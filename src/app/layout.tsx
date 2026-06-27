import React, { JSX } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { EmotionStyleRegistry } from './EmotionStyleRegistry';

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
        <EmotionStyleRegistry>{children}</EmotionStyleRegistry>
      </body>
    </html>
  );
}
