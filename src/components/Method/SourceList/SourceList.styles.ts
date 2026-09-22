import styled from '@emotion/styled';

export const List = styled.ol`
  margin: 10px 0 0;
  padding-inline-start: 18px;
  list-style: decimal;
  font-size: ${({ theme }): number => theme.typography.body}px;
  line-height: 1.75;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Entry = styled.li`
  margin-bottom: 7px;
`;

export const Citation = styled.a`
  display: block;
  font-size: ${({ theme }): number => theme.typography.label}px;
  color: ${({ theme }): string => theme.colors.primary};
  font-weight: 600;
  text-align: end;
  word-break: break-word;
`;
