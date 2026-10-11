import styled from '@emotion/styled';

export const DrawerTitle = styled.span`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const NoteLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 38px;

  & > * {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const DrawerError = styled.span`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alertText};
`;
