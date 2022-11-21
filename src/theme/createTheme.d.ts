import { Theme as SystemTheme, ThemeOptions } from '@mui/system';
import { CustomTheme, Palette } from '@mui/material/styles';

declare module '@mui/material/styles' {
  export interface ColorsInterface {
    primary: string;
    appBackground: string;
    inputBackground: string;
    bottomNavBackground: string;
    closeButtonBackground: string;
    primaryText: string;
    secondaryText: string;
    placeholderText: string;
    clickableGray: string;
    border: string;
    green: string;
    clickableGrayHover: string;
    hoverColor: string;
    disabledColor: string;
    nonClickableGray: string;
    loadingPrimary: string;
    loadingSecondary: string;
    errorPrimary: string;
    errorSecondary: string;
    successPrimary: string;
    successSecondary: string;
    warningPrimary: string;
    warningSecondary: string;
  }

  interface CustomPalette extends Palette {
    colors: ColorsInterface;
  }

  interface CustomTheme extends SystemTheme {
    palette: CustomPalette;
  }
  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    palette?: CustomPalette;
  }

  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

declare module '@emotion/react' {
  interface Theme extends CustomTheme {}
}
