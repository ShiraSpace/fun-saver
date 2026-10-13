import styled from '@emotion/styled';

export const CancelButton = styled.button`
  padding: 8px 16px;
  border: none;
  background: transparent;
  font: inherit;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;
