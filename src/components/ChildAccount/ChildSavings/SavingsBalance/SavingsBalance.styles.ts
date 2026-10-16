import styled from '@emotion/styled';
import { readByScreenReaderOnly } from '@/theme/accessibility';

export const Balance = styled.div`
  position: relative;
  margin: 2px 0 0;
  font-size: ${({ theme }): number => theme.typography.display}px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const AnnouncedBalance = styled.div`
  ${readByScreenReaderOnly}
`;
