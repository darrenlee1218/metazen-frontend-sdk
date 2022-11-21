import React from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

import { boxCreator } from '@components/boxCreator';

const Root = boxCreator({
  pb: 3,
  px: 3,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

export const AccountSecurityFinishPage = () => {
  const theme = useTheme() as CustomTheme;
  const navigate = useNavigate();
  return (
    <Root>
      <div style={{ flex: 1 }}>
        <Typography variant="h2" color="text.primary" fontWeight={'600'} textAlign={'center'} fontSize={'16px'} mt={1}>
          2-Factor Authentication
        </Typography>
        <Avatar
          sx={{
            ml: 'auto',
            mr: 'auto',
            mt: '48px',
            mb: '24px',
            maxHeight: '40px',
            bgcolor: theme.palette.colors.green,
          }}
        >
          <DoneIcon />
        </Avatar>
        <Typography color="text.primary" fontWeight={'600'} textAlign={'center'} fontSize={'24px'} mt={1}>
          2-factor authentication is now enabled!
        </Typography>
      </div>
      <div>
        <Button
          onClick={() => navigate('/account', { replace: true })}
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 3, mt: '8px', mb: '8px', pt: '10px', pb: '10px' }}
        >
          <Typography
            variant="h4"
            color={theme.palette.text.primary}
            fontSize="16px"
            fontWeight={'600'}
            textAlign="center"
            sx={{ fontWeight: '600', textTransform: 'capitalize' }}
          >
            Return to Account
          </Typography>
        </Button>
      </div>
    </Root>
  );
};
