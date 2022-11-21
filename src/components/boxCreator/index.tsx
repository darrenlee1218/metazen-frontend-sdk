import React, { FC } from 'react';

import Box, { BoxProps } from '@mui/material/Box';
import { SxProps, CustomTheme } from '@mui/material/styles';

export const boxCreator =
  (constantSxProps: SxProps<CustomTheme>): FC<BoxProps> =>
  ({ sx = {}, children, ...rest }) =>
    (
      <Box
        sx={
          {
            ...constantSxProps,
            ...sx,
          } as SxProps
        }
        {...rest}
      >
        {children}
      </Box>
    );
