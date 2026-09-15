import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { LANGUAGE_SECTION_STYLE } from './constants';

const selectedFill = ({ theme }: { theme: Theme }): string =>
  theme.gradients.actionButton;

const selectedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const optionSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.heading;

const segmentFill = ({ theme }: { theme: Theme }): string =>
  theme.colors.surface;

const segmentBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.divider;

export const Segment = styled.div`
  display: flex;
  border-radius: ${LANGUAGE_SECTION_STYLE.radius}px;
  overflow: hidden;
  border: 1px solid ${segmentBorder};
  background: ${segmentFill};
`;

export const Option = styled.span`
  flex: 1;
  text-align: center;
  padding: ${LANGUAGE_SECTION_STYLE.paddingY}px 0;
  font-size: ${optionSize}px;
  font-weight: 700;
  color: ${mutedText};

  &[data-selected='true'] {
    background: ${selectedFill};
    color: ${selectedText};
  }
`;
