import React from 'react';
import IconButton from '@mui/material/IconButton';
import { CustomTheme, useTheme, CSSObject } from '@mui/material';

interface IconProps {
  IconType: any;
  sx?: CSSObject;
  onClick?: () => void;
}

export default function Icon({ IconType = '', sx = {}, onClick = () => {} }: IconProps) {
  const theme = useTheme() as CustomTheme;
  return (
    <IconButton
      sx={{
        backgroundColor: theme.palette.colors.closeButtonBackground,
        ...sx,
      }}
      onClick={onClick}
    >
      <IconType sx={{ fontSize: '1rem' }} />
    </IconButton>
  );
}
