import React from 'react';
import { Box, CircularProgress, circularProgressClasses, CircularProgressProps, CSSObject } from '@mui/material';

interface InputProps {
  circularIndicatorProps?: CircularProgressProps;
  backgroundColor: string;
  value: number;
  color: string;
  size?: number;
  sx?: CSSObject;
}

const CircularProgressIndicator: React.FC<InputProps> = ({
  value = 0,
  circularIndicatorProps = {},
  backgroundColor = '',
  color = '',
  size = 32,
  sx = {},
}) => (
  <Box sx={{ position: 'relative', ...sx }}>
    <CircularProgress
      variant="determinate"
      sx={{
        color: `${backgroundColor}`,
      }}
      size={size}
      thickness={4}
      {...circularIndicatorProps}
      value={100}
    />
    <CircularProgress
      variant="determinate"
      sx={{
        color: `${color}`,
        position: 'absolute',
        left: 0,
        [`& .${circularProgressClasses.circle}`]: {
          strokeLinecap: 'round',
        },
      }}
      size={size}
      thickness={4}
      {...circularIndicatorProps}
      value={value}
    />
  </Box>
);

export default CircularProgressIndicator;
