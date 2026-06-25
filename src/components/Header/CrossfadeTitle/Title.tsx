'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { keyframes, type Theme } from '@emotion/react';
import { HEADER_LAYOUT } from '../constants';
import { TITLE_TEST_IDS } from './constants';

interface TitleProps {
  text: string;
}

const titleSize = ({ theme }: { theme: Theme }): number => theme.typography.h2;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Text = styled.span`
  position: relative;
  z-index: ${HEADER_LAYOUT.foregroundZIndex};
  flex: 1;
  text-align: center;
  font-size: ${titleSize}px;
  font-weight: ${HEADER_LAYOUT.nameWeight};
  color: inherit;
  animation: ${fadeIn} ${HEADER_LAYOUT.transitionMs}ms ease;
`;

export function Title({ text }: TitleProps): JSX.Element {
  return (
    <Text key={text} data-testid={TITLE_TEST_IDS.title}>
      {text}
    </Text>
  );
}
