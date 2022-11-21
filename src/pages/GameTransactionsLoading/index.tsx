import React from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';

const GameTransactionsLoadingPage = () => {
  return (
    <DefaultErrorBoundary>
      <Stack
        sx={{
          padding: '16px',
          height: 'calc(100% - 40px)',
        }}
      >
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Typography variant="h2" color="text.primary">
            Thank you.
          </Typography>
          <Typography variant="h2" color="text.primary">
            We are currently checking...
          </Typography>
        </Stack>
      </Stack>
    </DefaultErrorBoundary>
  );
};

export default GameTransactionsLoadingPage;
