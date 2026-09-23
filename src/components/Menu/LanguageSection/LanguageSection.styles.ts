import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { LANGUAGE_SECTION_STYLE } from './constants';
import { MENU_ROW_STYLE } from '../constants';

const selectedFill = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

const selectedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.surface;

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const optionSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.label;

const segmentFill = ({ theme }: { theme: Theme }): string =>
  theme.colors.surface;

const segmentBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.divider;

export const Segment = styled.div`
  display: flex;
  width: fit-content;
  border-radius: ${LANGUAGE_SECTION_STYLE.radius}px;
  overflow: hidden;
  border: ${MENU_ROW_STYLE.borderWidth}px solid ${segmentBorder};
  background: ${segmentFill};
`;

export const Option = styled.span`
  padding: ${LANGUAGE_SECTION_STYLE.paddingY}px
    ${LANGUAGE_SECTION_STYLE.paddingX}px;
  font-size: ${optionSize}px;
  font-weight: 600;
  color: ${mutedText};

  &[data-selected='true'] {
    background: ${selectedFill};
    color: ${selectedText};
  }
`;
