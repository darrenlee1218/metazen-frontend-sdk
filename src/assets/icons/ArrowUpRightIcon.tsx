import React, { FC } from 'react';
import { SVGIconProps } from '@gryfyn-types/props/SVGIconProps';

export const ArrowUpRightIcon: FC<SVGIconProps> = ({ width = '16px', height = '16px' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="CallMadeIcon"
  >
    <path d="M7 17L17 7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 7H17V17" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
