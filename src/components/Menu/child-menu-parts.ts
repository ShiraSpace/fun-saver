import styled from '@emotion/styled';
import { MENU_SECTION_TITLE_SIZE_VARIABLE } from './MenuSectionTitle/constants';

export const ChildMenuCard = styled.div`
  min-height: 76px;
  padding: 16px 18px;
  margin-bottom: 12px;
  border-radius: 22px;
  background: ${({ theme }): string => theme.colors.surface};
  ${MENU_SECTION_TITLE_SIZE_VARIABLE}: ${({ theme }): number =>
    theme.typography.heading}px;
`;
