import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material';

export const StatusReceiveIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="11.5" fill="#171D21" stroke="#20282D" />
    <path d="M15.3333 8.66675L8.66666 15.3334" stroke="#67D65B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.3333 15.3334H8.66666V8.66675" stroke="#67D65B" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
