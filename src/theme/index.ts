import { colors } from './colors';
import { spacing, radius, elevation, fontSize, lineHeight, fontWeight, iconSize } from './spacing';

export const theme = {
  colors,
  spacing,
  radius,
  elevation,
  fontSize,
  lineHeight,
  fontWeight,
  iconSize,
};

export type Theme = typeof theme;
export type ColorTheme = typeof colors.light;

export { colors, spacing, radius, elevation, fontSize, lineHeight, fontWeight, iconSize }; 