import styled from '@emotion/styled';

export const Breakdown = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
`;

export const Principal = styled.div`
  display: grid;
  gap: 2px;
  padding: 8px 0;
  border-radius: 14px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textMuted};
  background: ${({ theme }): string => theme.colors.softBg};
`;

export const InterestEarned = styled(Principal)`
  color: ${({ theme }): string => theme.colors.gainText};
  background: ${({ theme }): string => theme.colors.gainSoftBg};
`;

export const Amount = styled.span`
  justify-self: center;
  font-size: ${({ theme }): number => theme.typography.title}px;
  color: inherit;
`;
