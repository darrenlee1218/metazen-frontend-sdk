import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material';

export const LockIcon: FC<SvgIconProps> = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#fff"
    {...props}
  >
    <path
      d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2ZM7 11V7a5 5 0 1 1 10 0v4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
