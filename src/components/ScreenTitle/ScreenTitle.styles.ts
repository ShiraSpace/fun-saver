import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';

const titleSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.title;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: ${titleSize}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
`;

export const TitleIcon = styled.span`
  font-size: ${titleSize}px;
  line-height: 1;
`;
