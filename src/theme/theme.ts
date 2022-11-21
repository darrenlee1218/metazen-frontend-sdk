import { createTheme } from '@mui/material/styles';
import { ButtonProps } from '@mui/material/Button';
import palette, { AdditionalPalette } from './palette';
import colors from './colors';

export const defaultTheme = (additionalPalette?: AdditionalPalette) =>
  createTheme({
    palette: palette(additionalPalette),
    typography: {
      fontFamily: ['Basier Circle', 'graphie'].join(','),
      h6: {
        fontSize: '8px',
      },
      h5: {
        fontSize: '10px',
      },
      h4: {
        fontSize: '12px',
      },
      h3: {
        fontSize: '14px',
      },
      h2: {
        fontSize: '16px',
      },
      h1: {
        fontSize: '24px',
      },
    },
    shape: {
      borderRadius: 1,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
        @font-face {
          font-family: 'Basier Circle';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Basier Circle Regular'), local('BasierCircle-Regular'), url('./fonts/BasierCircle-Regular.ttf') format('truetype');
          unicodeRange: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF';
        }

        @font-face {
          font-family: 'Basier Circle';
          font-style: italic;
          font-display: swap;
          font-weight: 400;
          src: local('Basier Circle Regular Italic'), local('BasierCircle-RegularItalic'), url('./fonts/BasierCircle-RegularItalic.ttf') format('truetype');
          unicodeRange: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF';
        }

        @font-face {
          font-family: 'Basier Circle';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: local('Basier Circle Medium'), local('BasierCircle-Medium'), url('./fonts/BasierCircle-Medium.ttf') format('truetype');
          unicodeRange: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF';
        }

        @font-face {
          font-family: 'Basier Circle';
          font-style: italic;
          font-display: swap;
          font-weight: 500;
          src: local('Basier Circle Medium Italic'), local('BasierCircle-MediumItalic'), url('./fonts/BasierCircle-MediumItalic.ttf') format('truetype');
          unicodeRange: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF';
        }

        @font-face {
          font-family: 'Basier Circle';
          font-style: normal;
          font-display: swap;
          font-weight: 600;
          src: local('Basier Circle SemiBold'), local('BasierCircle-SemiBold'), url('./fonts/BasierCircle-SemiBold.ttf') format('truetype');
          unicodeRange: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF';
        }

        @font-face {
          font-family: 'Basier Circle';
          font-style: italic;
          font-display: swap;
          font-weight: 600;
          src: local('Basier Circle SemiBold Italic'), local('BasierCircle-SemiBoldItalic'), url('./fonts/BasierCircle-SemiBoldItalic.ttf') format('truetype');
          unicodeRange: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF';
        }

        @font-face {
          font-family: 'Basier Circle';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
          src: local('Basier Circle Bold'), local('BasierCircle-Bold'), url('./fonts/BasierCircle-Bold.ttf') format('truetype');
          unicodeRange: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF';
        }

        @font-face {
          font-family: 'Basier Circle';
          font-style: italic;
          font-display: swap;
          font-weight: 700;
          src: local('Basier Circle Bold Italic'), local('BasierCircle-BoldItalic'), url('./fonts/BasierCircle-BoldItalic.ttf') format('truetype');
          unicodeRange: 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF';
        }
        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          transition: background-color 600000s 0s, color 600000s 0s;
          box-shadow: none;
        }
      `,
      },
      MuiMobileStepper: {
        styleOverrides: {
          dot: {
            backgroundColor: colors.placeholderText,
          },
          dotActive: {
            backgroundColor: colors.primaryText,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: colors.inputBackground,
            borderRadius: 4,
            input: {
              fontSize: 12,
              '&::placeholder': {
                opacity: 1,
              },
              '&:-webkit-autofill': {
                '-webkitBoxShadow': `0 0 0px 1000px ${colors.inputBackground} inset`,
                '-webkit-text-fill-color': colors.primaryText,
              },
              '&:-webkit-autofill:focus': {
                '-webkitBoxShadow': `0 0 0px 1000px ${colors.inputBackground} inset`,
                '-webkit-text-fill-color': colors.primaryText,
              },
            },
            '&:hover': {
              border: '#282E36',
            },
            'input::placeholder': {
              color: colors.placeholderText,
            },
          },
          notchedOutline: {
            borderWidth: '1px !important',
            borderColor: `${additionalPalette?.colors?.border ?? colors.border} !important`,
            '.Mui-focused &': {
              borderColor: 'white !important',
            },
            '.MuiInputBase-colorWarning &': {
              borderColor: `${additionalPalette?.colors?.warningPrimary ?? colors.warningPrimary} !important`,
            },
            '.Mui-error &': {
              borderColor: `${additionalPalette?.colors?.errorPrimary ?? colors.errorPrimary} !important`,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            'input ~ svg': {
              color: additionalPalette?.colors?.border ?? colors.border,
            },
            'input:checked ~ svg': {
              color: additionalPalette?.primary?.main ?? colors.primary,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          // eslint-disable-next-line complexity
          root: ({ ownerState }: { ownerState: ButtonProps }) => ({
            textTransform: 'none',
            ...(ownerState.color === 'primary' && {
              color: colors.primaryText,
              '&:disabled': {
                backgroundColor: additionalPalette?.colors?.disabledColor ?? colors.disabledColor,
              },
            }),
            ...(ownerState.color === 'primary' &&
              ownerState.variant === 'contained' && {
                color: colors.primaryText,
                '&:hover': {
                  backgroundColor: additionalPalette?.colors?.hoverColor ?? colors.hoverColor,
                },
                '&:disabled': {
                  backgroundColor: additionalPalette?.colors?.disabledColor ?? colors.disabledColor,
                },
              }),
            ...(ownerState.color === 'secondary' && {
              color: colors.primaryText,
              borderColor: colors.secondaryText,
              backgroundColor: 'inherit',
              '&:hover': {
                borderColor: colors.secondaryText,
                backgroundColor: 'inherit',
              },
            }),
            ...(ownerState.color === 'secondary' &&
              ownerState.variant === 'contained' && {
                backgroundColor: colors.clickableGray,
                '&:hover': {
                  borderColor: colors.secondaryText,
                  backgroundColor: colors.clickableGrayHover,
                },
              }),
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            backgroundColor: colors.clickableGray,
            '&.Mui-disabled': {
              backgroundColor: colors.clickableGray,
              opacity: '50%',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          arrow: {
            color: colors.secondaryText,
          },
          tooltip: {
            backgroundColor: colors.secondaryText,
            padding: '4px',
            fontSize: 10,
            borderRadius: 3,
            fontWeight: 400,
          },
          tooltipPlacementTop: {
            marginBottom: '4px !important', // Hard to override tooltipPlacementTop
          },
        },
        defaultProps: {
          placement: 'top',
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: colors.secondaryText,
            '&.Mui-selected': {
              color: colors.primaryText,
              '.MuiTouchRipple-root': {
                height: '2px',
                width: '48px',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: additionalPalette?.primary?.main ?? colors.primary,
              },
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            '.MuiTabs-indicator': {
              height: '1px',
            },
          },
        },
      },
      MuiCardActionArea: {
        styleOverrides: {
          root: {
            ':hover': {
              backgroundColor: colors.clickableGrayHover,
            },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            fontSize: '10px',
            '.MuiInputBase-colorWarning ~ &': {
              color: `${additionalPalette?.colors?.warningPrimary ?? colors.warningPrimary} !important`,
            },
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: colors.appBackground,
            padding: 8,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            height: '23px',
            minHeight: '23px',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: 12,
            backgroundColor: colors.appBackground,
            '&:hover': {
              backgroundColor: colors.clickableGrayHover,
            },
            '&.Mui-selected': {
              backgroundColor: colors.nonClickableGray,
              color: colors.placeholderText,
              '&:hover': {
                backgroundColor: colors.nonClickableGray,
              },
            },
          },
        },
      },
    },
  });

export default defaultTheme;
