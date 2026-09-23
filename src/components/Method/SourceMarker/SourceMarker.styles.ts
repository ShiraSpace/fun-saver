import styled from '@emotion/styled';

export const Marker = styled.sup`
  margin-inline-start: 2px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  line-height: 0;
`;
