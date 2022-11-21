import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface DescriptionProps {
  description?: string;
}

export const Description: FC<DescriptionProps> = ({ description = '' }) => {
  return (
    <Box
      sx={{
        mx: '72px',
        my: '8px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography align="center" variant="h2" color="text.secondary" sx={{ fontSize: 10, fontWeight: 600 }}>
        {description}
      </Typography>
    </Box>
  );
};
