import styled from '@emotion/styled';

export const Close = styled.button`
  position: absolute;
  inset-block-start: 16px;
  inset-inline-start: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: ${({ theme }): string => theme.tints.film};
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;
