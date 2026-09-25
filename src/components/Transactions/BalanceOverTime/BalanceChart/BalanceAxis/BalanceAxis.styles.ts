import styled from '@emotion/styled';

export const Gridline = styled.line`
  stroke: ${({ theme }): string => theme.colors.divider};
  stroke-width: 1;
`;
