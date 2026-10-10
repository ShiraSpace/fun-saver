import styled from '@emotion/styled';

export const Line = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  padding: 10px 0 4px;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
`;

export const Thumb = styled.span`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  font-size: 20px;
  background: ${({ theme }): string => theme.gradients.walletSavings};
`;

export const Body = styled.span`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Top = styled.span<{ reached: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }): number => theme.typography.label + 1}px;
  font-weight: 700;
  color: ${({ reached, theme }): string =>
    reached ? theme.colors.gainText : theme.colors.textStrong};
`;
