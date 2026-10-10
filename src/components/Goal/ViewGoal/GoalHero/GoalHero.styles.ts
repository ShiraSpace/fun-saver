import styled from '@emotion/styled';

export const Hero = styled.div<{ reached: boolean }>`
  box-sizing: border-box;
  width: 100%;
  padding: 18px;
  border-radius: 22px;
  background: ${({ theme }): string => theme.colors.surface};
  box-shadow: ${({ reached, theme }): string =>
    reached
      ? `0 5px 0 ${theme.shadows.soft}, 0 0 0 4px ${theme.colors.celebrationGold}, 0 0 34px ${theme.colors.celebrationGold}`
      : `0 5px 0 ${theme.shadows.soft}`};
`;

export const Picture = styled.div`
  display: grid;
  place-items: center;
  height: 210px;
  margin-bottom: 14px;
  border-radius: 18px;
  font-size: 120px;
  background: ${({ theme }): string => theme.gradients.walletSavings};
`;

export const Name = styled.h2`
  margin: 0 0 16px;
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const Legend = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 8px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const Saved = styled.span`
  display: flex;
  gap: 4px;
  align-items: baseline;
  font-size: ${({ theme }): number => theme.typography.title}px;
  font-weight: 700;
`;

export const SavedSuffix = styled.span`
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 500;
`;

export const Amount = styled.span`
  display: flex;
  gap: 4px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const StillToSave = styled.div<{ reached: boolean }>`
  margin-top: 14px;
  padding: 9px;
  border-radius: 14px;
  border: 1.5px solid
    ${({ reached, theme }): string =>
      reached ? theme.colors.gainText : theme.colors.softBorder};
  background: ${({ reached, theme }): string =>
    reached ? theme.colors.gainSoftBg : theme.colors.softBg};
  color: ${({ reached, theme }): string =>
    reached ? theme.colors.gainText : theme.colors.softText};
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
`;
