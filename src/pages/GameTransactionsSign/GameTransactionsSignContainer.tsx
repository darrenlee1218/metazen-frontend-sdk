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
      Signature Request
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
    <Divider sx={{ mb: '6px' }} />
    <Typography variant="h4" color="text.secondary" sx={{ mb: '8px' }}>
      Message
    </Typography>
    <Typography variant="h5" color="text.primary">
      1234-1234-1234-1234
    </Typography>
    <Divider sx={{ mt: '8px' }} />
  </Box>
);

const GameTransactionsSignContainer = () => {
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
            color: theme.palette.text.secondary,
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
          onClick={() => navigate('/page/game-transactions-approve')}
          sx={{
            color: theme.palette.text.secondary,
            bgcolor: theme.palette.colors.primary,
            marginLeft: '15px',
            fontWeight: 'bold',
            ':hover': {
              bgcolor: theme.palette.colors.primary,
            },
          }}
        >
          Sign
        </ButtonComponent>
      </Box>
    </Box>
  );
};

export default GameTransactionsSignContainer;
