/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck //

import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const CustomStyleButton = styled(Button)<ButtonProps>(({ theme, color, variant }) => ({
  textTransform: 'none',
  borderRadius: '3px',
}));

const ButtonComponent: React.FC<CustomButtonProps> = ({ children, isLoading = false, ...rest }) => (
  <CustomStyleButton {...rest}>
    {isLoading ? (
      <>
        <CircularProgress color="primary" size={14} sx={{ p: 1 }} />
        {children}
      </>
    ) : (
      children
    )}
  </CustomStyleButton>
);

export default ButtonComponent;
