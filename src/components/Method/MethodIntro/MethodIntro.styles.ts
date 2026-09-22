import styled from '@emotion/styled';

export const Intro = styled.section`
  padding: 17px 16px;
  border-radius: 18px;
  border-top: 5px solid ${({ theme }): string => theme.colors.softBorder};
  background: ${({ theme }): string => theme.colors.surface};
  color: ${({ theme }): string => theme.colors.textStrong};
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.06);
  text-align: start;
`;

export const Eyebrow = styled.span`
  display: inline-block;
  margin-bottom: 10px;
  padding: 3px 9px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.softBg};
  color: ${({ theme }): string => theme.colors.softText};
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.07em;
`;

export const Title = styled.h1`
  margin: 0 0 12px;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 600;
`;

export const Lead = styled.p`
  margin: 0 0 14px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  line-height: 1.8;
`;

export const Outcomes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

export const Derived = styled.p`
  margin: 13px 0 0;
  font-size: 12.5px;
  line-height: 1.65;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  border-top: 1px solid ${({ theme }): string => theme.colors.divider};
`;

export const Brief = styled.p`
  margin: 0 0 5px;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 600;
`;

export const BriefNote = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: ${({ theme }): string => theme.colors.textMuted};
`;
