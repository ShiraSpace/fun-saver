import styled from '@emotion/styled';

export const Quote = styled.blockquote`
  margin: 10px 0;
  padding: 12px 13px;
  border-radius: 12px;
  border-inline-start: 4px solid
    ${({ theme }): string => theme.colors.softBorder};
  background: ${({ theme }): string => theme.colors.softBg};
  color: ${({ theme }): string => theme.colors.softText};
`;

export const Finding = styled.p`
  margin: 0;
  font-size: ${({ theme }): number => theme.typography.body}px;
  line-height: 1.7;
`;

export const Citation = styled.cite`
  display: block;
  margin-top: 7px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-style: normal;
  font-weight: 600;
  text-align: end;
`;
