import styled from '@emotion/styled';
import { PrimaryButton } from '@/components/PrimaryButton';

export const ReachedHeading = styled.p`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
`;

export const BackButton = styled(PrimaryButton)`
  align-self: stretch;
  margin: 0 22px;
`;
