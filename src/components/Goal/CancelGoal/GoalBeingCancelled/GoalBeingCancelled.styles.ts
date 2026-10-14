import styled from '@emotion/styled';

export const Picture = styled.div`
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  border-radius: 18px;
  font-size: 36px;
  background: ${({ theme }): string => theme.gradients.walletSavings};
`;

export const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const Line = styled.p`
  margin: 0 0 6px;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }): string => theme.colors.textMuted};
`;
