import styled from '@emotion/styled';

export const Section = styled.div`
  width: 100%;
  text-align: start;
`;

export const SectionLabel = styled.div`
  margin: 4px 4px 8px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
`;

export const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 14px;
  background: ${({ theme }): string => theme.colors.surface};
  box-shadow: 0 4px 0 ${({ theme }): string => theme.shadows.faint};
`;

export const Preview = styled.button`
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  padding: 0;
  border: none;
  border-radius: 18px;
  background: ${({ theme }): string => theme.colors.walletSavings};
  font-size: 54px;
  cursor: pointer;
`;

export const Swap = styled.span`
  position: absolute;
  inset-block-end: -4px;
  inset-inline-end: -4px;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ theme }): string => theme.colors.textStrong};
  color: ${({ theme }): string => theme.colors.surface};
  font-size: 13px;
`;
