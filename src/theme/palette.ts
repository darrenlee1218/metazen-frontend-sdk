import { DeepPartial } from '@gryfyn-types/generics';
import { CustomPalette } from '@mui/material/styles';
import Colors from './colors';
import { Mode } from './types';

export const commonPallete = {
  mode: Mode.Dark,
  primary: {
    main: Colors.primary,
  },
  colors: {
    ...Colors,
  },
  text: {
    primary: Colors.primaryText,
    secondary: Colors.secondaryText,
  },
  background: {
    default: Colors.appBackground,
    paper: Colors.appBackground,
  },
  loading: {
    main: Colors.loadingPrimary,
  },
  error: {
    main: Colors.errorPrimary,
  },
  info: {
    main: '#42CCEC',
  },
  success: {
    main: Colors.successPrimary,
  },
  warning: {
    main: Colors.warningPrimary,
  },
};

export type AdditionalPalette = DeepPartial<CustomPalette>;

const palette = (additionalPalette?: AdditionalPalette) =>
  ({
    ...commonPallete,
    ...additionalPalette,
    colors: {
      ...commonPallete.colors,
      ...additionalPalette?.colors,
    },
  } as unknown as CustomPalette);

export default palette;
