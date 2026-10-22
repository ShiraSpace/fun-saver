import React, { JSX, Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { applyStoredThemeScript, everyThemeAsCss } from '@/theme/theme-at-first-paint';
import { LoadingShell } from '@/components/LoadingShell';
import { TRAVELLING_BORDER_ANGLE_RULE } from '@/components/Goal/Celebration/constants';
import { LoaderProvider } from '@/hooks/loader-context';
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
        <style>{TRAVELLING_BORDER_ANGLE_RULE}</style>
        <script>{themeScript}</script>
        <EmotionStyleRegistry>
          <LoaderProvider>
            <Suspense fallback={<LoadingShell />}>{children}</Suspense>
          </LoaderProvider>
        </EmotionStyleRegistry>
      </body>
    </html>
  );
}
