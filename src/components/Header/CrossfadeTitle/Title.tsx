'use client';

import { JSX } from 'react';
import { TITLE_TEST_IDS } from './constants';
import { Text } from './Title.styles';

interface TitleProps {
  text: string;
}

export function Title({ text }: TitleProps): JSX.Element {
  return (
    <Text key={text} data-testid={TITLE_TEST_IDS.title}>
      {text}
    </Text>
  );
}
