import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material';

export const AwardIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.21 13.8899L7 22.9999L12 19.9999L17 22.9999L15.79 13.8799"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
