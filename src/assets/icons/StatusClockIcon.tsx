import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material';

export const StatusClockIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="11.5" fill="#171D21" stroke="#20282D" />
    <g clipPath="url(#clip0_32_2326)">
      <path
        d="M12 18.6666C15.6819 18.6666 18.6667 15.6818 18.6667 11.9999C18.6667 8.31802 15.6819 5.33325 12 5.33325C8.31811 5.33325 5.33334 8.31802 5.33334 11.9999C5.33334 15.6818 8.31811 18.6666 12 18.6666Z"
        stroke="#42CCEC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8V12L14.6667 13.3333" stroke="#42CCEC" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_32_2326">
        <rect width="16" height="16" fill="white" transform="translate(4 4)" />
      </clipPath>
    </defs>
  </svg>
);
