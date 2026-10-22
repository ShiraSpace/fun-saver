import styled from '@emotion/styled';

export const CoinSpace = styled.div`
  margin-bottom: -8px;
`;

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
  padding-bottom: 16px;
`;
