import React, { FC } from 'react';
import { SVGIconProps } from '@gryfyn-types/props/SVGIconProps';

export const CloseIcon: FC<SVGIconProps> = ({ width = '16px', height = '16px' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
