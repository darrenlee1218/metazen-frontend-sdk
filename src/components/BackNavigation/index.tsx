import React from 'react';

import Box from '@mui/material/Box';
import { CSSObject } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackNavigationProps {
  /**
   * label for the sub-navbar
   */
  label?: string;

  /**
   * optional - custom back button press event
   */
  onBackPress: () => void;
  sx?: CSSObject;
  labelProps?: CSSObject;
}

export const BackNavigation: React.FunctionComponent<BackNavigationProps> = ({
  label,
  onBackPress,
  sx = {},
  labelProps = {},
}) => {
  return (
    <Box
      sx={{
        mx: '16px',
        my: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      <IconButton size="small" onClick={onBackPress}>
        <ArrowBackIcon sx={{ fontSize: '16px' }} />
      </IconButton>
      <Typography
        align="center"
        variant="h2"
        color="text.primary"
        sx={{ fontSize: { lg: 20, md: 18, sm: 16 }, fontWeight: 600, ...labelProps }}
      >
        {label}
      </Typography>
      {/* Empty box for justify-content */}
      {/* make sure keep same with as IconButton */}
      <Box sx={{ width: '26px' }} />
    </Box>
  );
};

export default BackNavigation;
