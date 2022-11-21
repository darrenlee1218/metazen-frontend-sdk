import React, { FC } from 'react';
import { SVGIconProps } from '@gryfyn-types/props/SVGIconProps';

export const SpeedUpIcon: FC<SVGIconProps> = ({ width = '16px', height = '16px' }) => (
  <svg width={width} height={height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.44444 1.55566L2 6.889H6L5.55556 10.4446L10 5.11122H6L6.44444 1.55566Z"
      stroke="#67D65B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
