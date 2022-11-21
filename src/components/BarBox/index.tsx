import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

interface BarBoxProps {
  label: string;
}

const BarBox: FC<BarBoxProps> = ({ label, children }) => {
  const theme = useTheme() as CustomTheme;
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        boxShadow: 1,
        width: '100%',
        borderRadius: 3,
        backgroundColor: theme.palette.colors.clickableGray,
      }}
    >
      <Typography variant="h4" sx={{ color: 'text.secondary', mb: 1 }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
};

export default BarBox;
