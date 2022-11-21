import React, { FC } from 'react';
import { SVGIconProps } from '@gryfyn-types/props/SVGIconProps';

export const ArrowDownLeftIcon: FC<SVGIconProps> = ({ width = '16px', height = '16px' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="CallReceivedIcon"
  >
    <path d="M17 7L7 17" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 17H7V7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
