import React, { FC } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@theme/theme';

export const TestProviders: FC = ({ children }) => {
  return <ThemeProvider theme={theme()}>{children}</ThemeProvider>;
};
