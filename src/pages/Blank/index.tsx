import React, { FC } from 'react';
import Colors from '@theme/colors';
import Box from '@mui/material/Box';

export const BlankPage: FC = () => {
  return <Box sx={{ height: '100vh', bgcolor: Colors.appBackground }} />;
};
