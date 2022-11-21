import React from 'react';
import { Box } from '@mui/system';
import { CustomTheme, useTheme, CSSObject } from '@mui/material';

interface ImageProps {
  src: string;
  sx?: CSSObject;
}

export default function ImageTile({ src = '', sx = {} }: ImageProps) {
  const theme = useTheme() as CustomTheme;
  return (
    <Box
      component="div"
      bgcolor={theme.palette.colors.clickableGray}
      sx={{
        width: '100%',
        minHeight: '20px',
        border: '1px solid',
        borderColor: theme.palette.colors.border,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        ...sx,
      }}
    />
  );
}
