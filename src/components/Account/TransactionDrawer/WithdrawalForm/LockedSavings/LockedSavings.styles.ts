import styled from '@emotion/styled';

export const Panel = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  flex: 1;
  padding: 14px;
  border: 1.5px solid ${({ theme }): string => theme.colors.softBorder};
  border-radius: 18px;
  background: ${({ theme }): string => theme.colors.softBg};
  text-align: center;
`;

export const Thumb = styled.span`
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin: 0 auto;
  border-radius: 16px;
  font-size: 32px;
  background: ${({ theme }): string => theme.gradients.walletSavings};
`;

export const Heading = styled.b`
  font-size: ${({ theme }): number => theme.typography.body + 1}px;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const StillToSave = styled.span`
  margin-bottom: 4px;
  font-size: ${({ theme }): number => theme.typography.label + 1}px;
  color: ${({ theme }): string => theme.colors.softText};
`;
