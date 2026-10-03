import styled from '@emotion/styled';

export const Card = styled.section`
  padding: 22px 18px 18px;
  text-align: center;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: 22px;
  box-shadow: 0 5px 0 ${({ theme }): string => theme.shadows.faint};
`;

export const Icon = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto 10px;
  display: grid;
  place-items: center;
  font-size: ${({ theme }): number => theme.typography.amount}px;
  border-radius: 22px;
  background: ${({ theme }): string => theme.gradients.walletSavings};
`;

export const Title = styled.div`
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Total = styled.div`
  margin: 6px 0 4px;
  font-size: ${({ theme }): number => theme.typography.display}px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
`;

export const Tile = styled.div`
  display: grid;
  gap: 2px;
  padding: 8px 0;
  border-radius: 14px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textMuted};
  background: ${({ theme }): string => theme.colors.softBg};
`;

export const Earned = styled(Tile)`
  color: ${({ theme }): string => theme.colors.gainText};
  background: ${({ theme }): string => theme.colors.gainSoftBg};
`;

export const TileAmount = styled.span`
  justify-self: center;
  font-size: ${({ theme }): number => theme.typography.title}px;
  color: inherit;
`;
