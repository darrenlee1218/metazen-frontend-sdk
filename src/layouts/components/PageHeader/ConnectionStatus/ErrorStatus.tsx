import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ErrorStatusProps {
  color: string;
  message: string;
}
const ErrorStatus = ({ color = '', message = '' }: ErrorStatusProps) => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography variant="caption" color="text.primary">
      {message}
    </Typography>
  </Box>
);

export default ErrorStatus;
