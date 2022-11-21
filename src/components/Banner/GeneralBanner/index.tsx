import React from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import { CSSObject } from '@mui/material/styles';

interface GeneralBannerProps {
  message: string;
  /*
    error, warning, info, success
  */
  severity: AlertColor;
  onClose?: () => void;
  sx?: CSSObject;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const GeneralBanner: React.FC<GeneralBannerProps> = ({ message, severity, onClose, sx = {}, icon, ...rest }) => (
  <Alert
    variant="filled"
    severity={severity}
    onClose={onClose}
    icon={icon}
    {...rest}
    sx={{
      ...sx,
    }}
  >
    {message}
  </Alert>
);

export default GeneralBanner;
