import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material';

export const StatusSendIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="11.5" fill="#171D21" stroke="#20282D" />
    <path d="M8.66666 15.3334L15.3333 8.66675" stroke="#42CCEC" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.66666 8.66675H15.3333V15.3334" stroke="#42CCEC" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
