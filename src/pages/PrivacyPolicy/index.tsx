import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export const PrivacyPolicyPage = () => (
  <Container maxWidth="sm" sx={{ pt: '16px', boxSizing: 'border-box' }}>
    <Typography color="text.primary" variant="h2" gutterBottom>
      Privacy Policy (Under Construction)
    </Typography>
    <Box
      sx={{
        mb: 2,
        pr: 1,
        height: '310px',
        overflow: 'hidden',
        overflowY: 'auto',
      }}
    >
      <Typography color="text.primary">
        A Privacy Policy is a statement or a legal document that states how a company or website collects, handles and
        processes data of its customers and visitors. It explicitly describes whether that information is kept
        confidential, or is shared with or sold to third parties. Personal information about an individual may include
        the following: Name Address Email Phone number Age Sex Marital status Race Nationality Religious beliefs For
        example, an excerpt from Pinterest&apos;s Privacy Policy agreement clearly describes the information Pinterest
        collects from its users as well as from any other source that users enable Pinterest to gather information from.
        The information that the user voluntarily gives includes names, photos, pins, likes, email address, and/or phone
        number etc., all of which is regarded as personal information.
      </Typography>
    </Box>
  </Container>
);
