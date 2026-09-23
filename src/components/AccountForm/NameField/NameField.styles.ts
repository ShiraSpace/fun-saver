import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { NAME_FIELD_STYLE } from './constants';

const surface = ({ theme }: { theme: Theme }): string => theme.colors.surface;

const labelColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const faintShadow = ({ theme }: { theme: Theme }): string =>
  theme.shadows.faint;

const valueColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

export const Card = styled.label`
  display: flex;
  align-items: center;
  gap: ${NAME_FIELD_STYLE.gap}px;
  width: 100%;
  max-width: ${NAME_FIELD_STYLE.maxWidth}px;
  padding: ${NAME_FIELD_STYLE.paddingY}px ${NAME_FIELD_STYLE.paddingX}px;
  border-radius: ${NAME_FIELD_STYLE.radius}px;
  background: ${surface};
  box-shadow: 0 4px 0 ${faintShadow};
  color: ${labelColor};
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  font-weight: 700;
  color: ${valueColor};
`;
