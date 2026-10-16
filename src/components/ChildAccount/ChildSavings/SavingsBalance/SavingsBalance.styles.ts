import styled from '@emotion/styled';

export const Balance = styled.div`
  position: relative;
  margin: 2px 0 0;
  font-size: ${({ theme }): number => theme.typography.display}px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const AnnouncedBalance = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;
