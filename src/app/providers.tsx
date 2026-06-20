'use client';

import { JSX, ReactNode, useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache, { type EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const EMOTION_KEY = 'fs';

interface ProvidersProps {
  children: ReactNode;
}

interface Registry {
  cache: EmotionCache;
  flush: () => string[];
}

export function Providers({ children }: ProvidersProps): JSX.Element {
  const [registry] = useState(() => createRegistry());

  useServerInsertedHTML(() => {
    const names = registry.flush();

    if (names.length === 0) {
      return null;
    }

    let styles = '';

    for (const name of names) {
      styles += registry.cache.inserted[name];
    }

    return (
      <style
        data-emotion={`${registry.cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}

function createRegistry(): Registry {
  const cache = createCache({
    key: EMOTION_KEY,
    stylisPlugins: [prefixer, rtlPlugin],
  });

  cache.compat = true;

  let inserted: string[] = [];

  const originalInsert = cache.insert.bind(cache);

  cache.insert = (...args): string | void => {
    const serialized = args[1];

    if (cache.inserted[serialized.name] === undefined) {
      inserted.push(serialized.name);
    }

    return originalInsert(...args);
  };

  const flush = (): string[] => {
    const flushed = inserted;

    inserted = [];

    return flushed;
  };

  return { cache, flush };
}
