import styled from '@emotion/styled';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { Themed } from '@/theme/themed';

const surface = ({ theme }: Themed): string => theme.colors.surface;

export const Scrim = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }): string => theme.tints.shade};
`;

export const Card = styled.div`
  position: fixed;
  top: 50%;
  inset-inline: 18px;
  box-sizing: border-box;
  max-width: 420px;
  margin-inline: auto;
  padding: 22px 18px 18px;
  border-radius: 24px;
  background: ${surface};
  box-shadow: 0 18px 40px ${({ theme }): string => theme.shadows.deep};
  text-align: center;
  transform: translateY(-50%);
  outline: none;
`;

export const KeepButton = styled(PrimaryButton)`
  width: 100%;
  margin: 18px 0 12px;
  padding: 13px;
  font-size: 16px;
`;

export const CancelError = styled.p`
  margin: 10px 0 0;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alertText};
`;
