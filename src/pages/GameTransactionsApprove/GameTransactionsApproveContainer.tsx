import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { CustomTheme, useTheme } from '@mui/material';

import TitleWithIconOnTop from '@components/TitleWithIconOnTop';
import ImageTile from '@components/ImageTile';
import ButtonComponent from '@components/Button';

const mockGameImgSrc = 'https://picsum.photos/200';

const imageLayout = (
  <ImageTile
    src={mockGameImgSrc}
    sx={{
      maxWidth: '60px',
      borderRadius: '8px',
      minHeight: '60px',
      marginTop: '40px',
    }}
  />
);

const titleLayout = (
  <>
    <Typography variant="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
      Race Now
    </Typography>
    <Typography variant="h5" color="text.primary">
      url-of-game.com
    </Typography>
  </>
);

const contentLayout = (
  <Box
    sx={{
      flex: 1,
      marginTop: '32px',
    }}
  >
    <Typography variant="h4" color="text.secondary" sx={{ mb: '8px' }}>
      Transaction Details
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '8px' }}>
      <Typography variant="h1" color="text.primary">
        TICKER
      </Typography>
      <Typography variant="h1" color="text.primary">
        -# TICKER
      </Typography>
    </Box>
    <Divider sx={{ mb: '6px' }} />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '8px' }}>
      <Typography variant="h5" color="text.primary">
        Network
      </Typography>
      <Typography variant="h5" color="text.primary">
        Blockchain Name
      </Typography>
    </Box>
    <Divider sx={{ mb: '6px' }} />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '8px' }}>
      <Typography variant="h5" color="text.primary">
        Recipient Address
      </Typography>
      <Typography variant="h5" color="text.primary">
        Address
      </Typography>
    </Box>
  </Box>
);

const GameTransactionsApproveContainer = () => {
  const navigate = useNavigate();
  const theme = useTheme() as CustomTheme;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        height: 'calc(100% - 40px)',
      }}
    >
      <TitleWithIconOnTop imageLayout={imageLayout} titleLayout={titleLayout} />
      {contentLayout}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ButtonComponent
          fullWidth
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            color: theme.palette.text.primary,
            bgcolor: theme.palette.colors.clickableGray,
            fontWeight: 'bold',
            ':hover': {
              bgcolor: theme.palette.colors.clickableGray,
            },
          }}
        >
          Cancel
        </ButtonComponent>
        <ButtonComponent
          fullWidth
          variant="contained"
          onClick={() => navigate('/page/game-transactions-loading')}
          sx={{
            color: theme.palette.text.primary,
            bgcolor: theme.palette.colors.primary,
            marginLeft: '15px',
            fontWeight: 'bold',
            ':hover': {
              bgcolor: theme.palette.colors.primary,
            },
          }}
        >
          Approve
        </ButtonComponent>
      </Box>
    </Box>
  );
};

export default GameTransactionsApproveContainer;
