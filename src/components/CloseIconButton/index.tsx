import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { CustomTheme, useTheme } from '@mui/material/styles';

interface CloseIconButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CloseIconButton: React.FC<CloseIconButtonProps> = ({ onClick }) => {
  const theme = useTheme() as CustomTheme;
  return (
    <IconButton
      onClick={onClick}
      size="small"
      sx={{ backgroundColor: theme.palette.colors.closeButtonBackground, width: '24px', height: '24px' }}
      data-testid="close-icon-button"
    >
      <CloseIcon fontSize="small" sx={{ color: theme.palette.text.primary, fontSize: '16px' }} />
    </IconButton>
  );
};

export default CloseIconButton;
