import React from 'react';
import Stack from '@mui/material/Stack';
import Typograpy from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

interface CircularIconButtonProps {
  label: string;
  icon: JSX.Element;
  disabled?: boolean;
  onClick?: () => void;
}

export const CircularIconButton: React.FC<CircularIconButtonProps> = ({ icon, label, disabled, onClick }) => {
  return (
    <Stack spacing={0.5} direction="column" alignItems="center">
      <IconButton onClick={onClick} disabled={disabled} sx={{ width: '40px', height: '40px' }}>
        {icon}
      </IconButton>
      <Typograpy color="text.primary" sx={{ fontSize: '12px', opacity: `${disabled ? '50%' : '100%'}` }}>
        {label}
      </Typograpy>
    </Stack>
  );
};
