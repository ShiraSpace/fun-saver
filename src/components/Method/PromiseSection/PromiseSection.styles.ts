import styled from '@emotion/styled';

export const Rules = styled.div`
  > * {
    padding: 9px 0;
    border-bottom: 1px solid ${({ theme }): string => theme.colors.divider};
  }

  > *:last-child {
    border-bottom: none;
  }
`;
