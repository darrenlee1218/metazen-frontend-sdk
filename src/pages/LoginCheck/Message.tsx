import { boxCreator } from '@components/boxCreator';
import { CustomTheme, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { FC } from 'react';

import { Box } from '@mui/material';
import backgroundRevvRacingSrc from '../../demo/assets/revv-racing/Revv-Racing-Background.png';

const ContentBox = boxCreator({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
});

export const Message: FC = () => {
  const theme = useTheme() as CustomTheme;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${backgroundRevvRacingSrc})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundColor: theme.palette.colors.appBackground,
      }}
    >
      <ContentBox>
        <Typography align="center" variant="h2" color="text.primary" fontWeight={600} mt={8}>
          Your email has been verified.
        </Typography>
        <Typography align="center" variant="h4" color="text.secondary" mt={2}>
          You may close this tab now. If you are using Safari, you will have to reload it manually.
        </Typography>
      </ContentBox>
    </Box>
  );
};
