import styled from '@emotion/styled';

export const TapTheCoins = styled.p`
  min-height: 20px;
  margin: 0;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.gainText};
`;

export const CoinRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 6px;
  height: 61px;
  margin-bottom: -8px;
  padding-bottom: 16px;
`;
