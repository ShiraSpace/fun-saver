import styled from '@emotion/styled';

export const Intro = styled.section`
  padding: 17px 16px;
  border-radius: 18px;
  background: ${({ theme }): string => theme.gradients.primaryButton};
  color: ${({ theme }): string => theme.colors.textOnPrimary};
  box-shadow: 0 4px 0 ${({ theme }): string => theme.shadows.soft};
  text-align: start;
`;

export const Eyebrow = styled.span`
  display: inline-block;
  margin-bottom: 10px;
  padding: 3px 9px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.tints.film};
  font-size: ${({ theme }): number => theme.typography.label}px;
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
  font-size: ${({ theme }): number => theme.typography.body}px;
  line-height: 1.65;
  opacity: 0.82;
`;

export const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  border-top: 1px solid ${({ theme }): string => theme.tints.film};
`;

export const Brief = styled.p`
  margin: 0 0 5px;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 600;
`;

export const BriefNote = styled.p`
  margin: 0;
  font-size: ${({ theme }): number => theme.typography.body}px;
  line-height: 1.65;
  opacity: 0.88;
`;
