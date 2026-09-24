'use client';

import { JSX } from 'react';
import { HEADER_TITLE_TEST_IDS } from './constants';
import { Text } from './HeaderTitle.styles';

interface HeaderTitleProps {
  text: string;
}

export function HeaderTitle({ text }: HeaderTitleProps): JSX.Element {
  return (
    <Text key={text} data-testid={HEADER_TITLE_TEST_IDS.title}>
      {text}
    </Text>
  );
}
