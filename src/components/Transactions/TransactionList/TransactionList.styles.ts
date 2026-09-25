import styled from '@emotion/styled';

export const Card = styled.section`
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: 24px;
  padding: 11px 0 14px;
  box-shadow: 0 6px 0 ${({ theme }): string => theme.shadows.faint};
  color: ${({ theme }): string => theme.colors.textStrong};
  text-align: start;
`;

export const Head = styled.div`
  padding: 0 14px 7px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
`;

export const Count = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const SubTitle = styled.p`
  margin: 11px 0 5px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
`;

export const EmptyMessage = styled.p`
  margin: 0;
  padding: 28px 16px;
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.label}px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;
