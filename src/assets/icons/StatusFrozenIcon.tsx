import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material';

export const StatusFrozenIcon: FC<SvgIconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="11.5" fill="#171D21" stroke="#20282D" />
    <path
      d="M10.86 6.57323L5.21335 15.9999C5.09693 16.2015 5.03533 16.4301 5.03467 16.6629C5.03402 16.8957 5.09434 17.1246 5.20963 17.3269C5.32492 17.5292 5.49116 17.6977 5.69182 17.8158C5.89247 17.9339 6.12055 17.9973 6.35335 17.9999H17.6467C17.8795 17.9973 18.1076 17.9339 18.3082 17.8158C18.5089 17.6977 18.6751 17.5292 18.7904 17.3269C18.9057 17.1246 18.966 16.8957 18.9654 16.6629C18.9647 16.4301 18.9031 16.2015 18.7867 15.9999L13.14 6.57323C13.0212 6.3773 12.8538 6.21531 12.6541 6.10288C12.4545 5.99046 12.2292 5.9314 12 5.9314C11.7709 5.9314 11.5456 5.99046 11.3459 6.10288C11.1462 6.21531 10.9789 6.3773 10.86 6.57323V6.57323Z"
      stroke="#EB7C4A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 10V12.6667" stroke="#EB7C4A" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15.3333H12.0067" stroke="#EB7C4A" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
