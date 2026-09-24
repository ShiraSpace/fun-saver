import styled from '@emotion/styled';
import { DrawerError } from '../../drawer-parts';

export const Overdraft = styled(DrawerError)`
  background: ${({ theme }): string => theme.colors.alertSoftBg};
  border-radius: 12px;
  padding: 7px 10px;
`;
