import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material';

export const SendIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M21 1L14 21L10 12L1 8L21 1Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
