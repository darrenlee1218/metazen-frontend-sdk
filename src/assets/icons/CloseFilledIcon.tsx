import React, { FC } from 'react';
import { SVGIconProps } from '@gryfyn-types/props/SVGIconProps';

export const CloseFilledIcon: FC<SVGIconProps> = ({ width = '16px', height = '16px' }) => (
  <svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    data-testid="CancelIcon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.09" />
    <path d="M16 8L8 16" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8L16 16" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
