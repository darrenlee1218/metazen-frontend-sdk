import React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import KeyIcon from '@mui/icons-material/Key';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';
import PhoneIphoneSharpIcon from '@mui/icons-material/PhoneIphoneSharp';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

interface OptionProps {
  type: string;
  configured?: boolean;
  onClick: () => void;
}

const AccountSecurityOption: React.FC<OptionProps> = ({ type, configured, onClick }) => {
  const theme = useTheme() as CustomTheme;
  return (
    <Button
      onClick={onClick}
      disabled={configured}
      fullWidth
      variant="contained"
      color="secondary"
      sx={{
        borderRadius: 3,
        mt: '8px',
        mb: '8px',
        pt: '12px',
        pb: '12px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ maxWidth: '24px', maxHeight: '24px' }} src={''}>
          {type === 'passcode' ? (
            <KeyIcon sx={{ maxHeight: '8px', maxWidth: '8px', color: 'white', transform: 'rotate(-45deg)' }} />
          ) : (
            <PhoneIphoneSharpIcon sx={{ maxHeight: '8px', maxWidth: '8px', color: 'white' }} />
          )}
        </Avatar>
        <Typography
          variant="h4"
          color={theme.palette.text.primary}
          sx={{ fontWeight: '600', marginLeft: '8px', textTransform: 'capitalize' }}
        >
          {type === 'passcode' ? 'Passcode' : '2-Factor Authentication'}
        </Typography>
      </div>
      {configured ? (
        <Typography sx={{ textTransform: 'capitalize', fontSize: '12px', color: theme.palette.colors.green }}>
          On
        </Typography>
      ) : (
        <ArrowForwardIosOutlinedIcon fontSize="small" />
      )}
    </Button>
  );
};

export default AccountSecurityOption;
