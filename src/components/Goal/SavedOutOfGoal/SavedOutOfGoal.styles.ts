import styled from '@emotion/styled';

export const Amounts = styled.span`
  display: inline-flex;
  align-items: baseline;
  flex-shrink: 0;
  gap: 4px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.textMuted};
`;
