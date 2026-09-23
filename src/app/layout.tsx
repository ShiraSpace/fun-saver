import React, { JSX, Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import {
  applyStoredThemeScript,
  everyThemeAsCss,
} from '@/theme/theme-at-first-paint';
import { LoadingShell } from '@/components/LoadingShell';
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
  const themeCss = everyThemeAsCss();
  const themeScript = applyStoredThemeScript();

  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <style>{themeCss}</style>
        <script>{themeScript}</script>
        <EmotionStyleRegistry>
          <Suspense fallback={<LoadingShell />}>{children}</Suspense>
        </EmotionStyleRegistry>
      </body>
    </html>
  );
}
