import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export const DataDeletionPolicyPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ pt: '16px' }}>
    <Box
      sx={{
        mb: 2,
        pr: 1,
        height: '310px',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h2" color="text.primary" gutterBottom>
        Data Deletion Policy (Under Construction)
      </Typography>
      <Typography color="text.primary">
        Apps that access user data must provide a way for users to request that their data be deleted. Your app can
        satisfy this requirement by providing either a data deletion request callback or instructions to inform people
        how to delete their data from your app or website.
      </Typography>
    </Box>
  </Container>
);
