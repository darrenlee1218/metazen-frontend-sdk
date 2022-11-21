import React from 'react';

import Box from '@mui/material/Box';
import { CSSObject } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

interface InputProps {
  sx?: CSSObject;
}

const LoadingIndicator: React.FC<InputProps> = ({ sx }: InputProps) => (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...sx,
    }}
  >
    <CircularProgress disableShrink />
  </Box>
);

export default LoadingIndicator;
