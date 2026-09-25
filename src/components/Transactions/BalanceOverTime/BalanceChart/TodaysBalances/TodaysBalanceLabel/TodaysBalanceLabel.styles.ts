import styled from '@emotion/styled';
import { readableOverLines } from '../../chart-parts';

export const LabelText = styled.text`
  ${readableOverLines}
  font-size: 9.5px;
  font-weight: 700;
  stroke-width: 3px;
  fill: ${({ theme }): string => theme.colors.textStrong};
`;
