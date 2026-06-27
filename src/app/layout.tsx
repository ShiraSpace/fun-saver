import React, { JSX } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { resolveThemeId, THEME_COOKIE } from '@/theme/theme-cookie';
import { ThemeController } from '@/theme/ThemeController';
import './globals.css';
import { EmotionStyleRegistry } from './EmotionStyleRegistry';

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
        <EmotionStyleRegistry>
          <ThemeController initialThemeId={initialThemeId}>
            {children}
          </ThemeController>
        </EmotionStyleRegistry>
      </body>
    </html>
  );
}
