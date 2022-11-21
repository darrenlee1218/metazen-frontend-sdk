import React from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme, CustomTheme } from '@mui/material/styles';
import { connectedHostInfo } from '@services/web3/web3-api-service/connectedHostInfo';

const InGameSigningPageHeader: React.FC = () => {
  const theme = useTheme() as CustomTheme;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Avatar
        alt="Revv Racing"
        src="https://hex-asset-icon.hextech.io/assets/png/REVV.png"
        sx={{ width: 60, height: 60 }}
      />
      <Typography variant="h1" sx={{ mt: 2, textAlign: 'center' }} color={theme.palette.colors.primaryText}>
        Signature Request
      </Typography>
      <Typography variant="h3" sx={{ mt: 2, textAlign: 'center' }} color={theme.palette.colors.secondaryText}>
        {connectedHostInfo.getHostDomain()}
      </Typography>
    </Box>
  );
};

export default InGameSigningPageHeader;
