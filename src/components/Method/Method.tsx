'use client';

import { JSX } from 'react';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { MethodIntro } from './MethodIntro';
import { WalletsSection } from './WalletsSection';
import { WhySection } from './WhySection';
import { METHOD_COPY } from './copy';
import { Column } from './Method.styles';

export function Method(): JSX.Element {
  return (
    <Screen align="top">
      <Column>
        <Header title={METHOD_COPY.title} />
        <MethodIntro />
        <WhySection />
        <WalletsSection />
      </Column>
    </Screen>
  );
}
