'use client';

import { JSX, ReactNode, useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache, { type EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const EMOTION_KEY = 'fs';

interface EmotionStyleRegistryProps {
  children: ReactNode;
}

interface SsrStyleCache {
  cache: EmotionCache;
  flushPendingStyleNames: () => string[];
}

export function EmotionStyleRegistry({
  children,
}: EmotionStyleRegistryProps): JSX.Element {
  const [{ cache, flushPendingStyleNames }] = useState(createEmotionCache);

  useServerInsertedHTML(() => {
    const styleNames = flushPendingStyleNames();

    if (styleNames.length === 0) {
      return null;
    }

    let styles = '';

    for (const name of styleNames) {
      styles += cache.inserted[name];
    }

    return (
      <style
        data-emotion={`${cache.key} ${styleNames.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

function createEmotionCache(): SsrStyleCache {
  const cache = createCache({
    key: EMOTION_KEY,
    stylisPlugins: [prefixer, rtlPlugin],
  });

  cache.compat = true;

  let pendingStyleNames: string[] = [];

  const insertStyle = cache.insert.bind(cache);

  cache.insert = (...args): string | void => {
    const serializedStyle = args[1];

    if (cache.inserted[serializedStyle.name] === undefined) {
      pendingStyleNames.push(serializedStyle.name);
    }

    return insertStyle(...args);
  };

  const flushPendingStyleNames = (): string[] => {
    const flushed = pendingStyleNames;

    pendingStyleNames = [];

    return flushed;
  };

  return { cache, flushPendingStyleNames };
}
