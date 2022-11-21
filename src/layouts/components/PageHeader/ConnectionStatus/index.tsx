import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

const STATUS_TEXT: { [key: string]: string } = {
  success: 'Connected',
};

const ConnectionStatus: React.FunctionComponent = () => {
  // TODO: some way to get connection status
  // TODO: confirm status and colors
  const [status, getStatus] = useState('success');
  const theme = useTheme() as CustomTheme;

  return (
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
          bgcolor: theme.palette.success.main,
        }}
      />
      <Typography variant="h4" color="text.primary">
        {STATUS_TEXT[status]}
      </Typography>
    </Box>
  );
};

export default ConnectionStatus;
