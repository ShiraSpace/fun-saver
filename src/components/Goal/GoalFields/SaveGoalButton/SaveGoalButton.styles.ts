import styled from '@emotion/styled';
import { GoalScreenButton } from '../../goal-parts';
import { LoaderBar } from '@/components/Header/LoaderBar';

export const SubmitButton = styled(GoalScreenButton)`
  position: relative;
  overflow: hidden;

  &:disabled {
    cursor: progress;
  }
`;

export const SaveError = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alertText};
`;

export const SavingBar = styled(LoaderBar)`
  &::after {
    background: ${({ theme }): string => theme.colors.textOnPrimary};
  }
`;
