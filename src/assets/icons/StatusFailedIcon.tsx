import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material';

export const StatusFailedIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="11.5" fill="#171D21" stroke="#20282D" />
    <path d="M16 8L8 16" stroke="#FA4D56" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8L16 16" stroke="#FA4D56" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
