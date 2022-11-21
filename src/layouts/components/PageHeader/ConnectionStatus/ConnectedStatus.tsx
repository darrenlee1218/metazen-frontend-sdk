import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface InputProps {
  color: string;
  message: string;
}
const ConnectedStatus: React.FC<InputProps> = ({ color = '', message = '' }) => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        ml: '8px',
        mr: '4px',
        width: '4px',
        height: '4px',
        borderRadius: '2px',
        bgcolor: color,
      }}
    />
    <Typography variant="h4" color="text.primary">
      {message}
    </Typography>
  </Box>
);

export default ConnectedStatus;
