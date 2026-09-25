import styled from '@emotion/styled';

export const Card = styled.section`
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: 24px;
  padding: 13px 14px 11px;
  box-shadow: 0 6px 0 ${({ theme }): string => theme.shadows.faint};
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 8px 0 2px;
`;
