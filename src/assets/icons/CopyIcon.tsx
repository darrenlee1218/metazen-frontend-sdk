import React, { FC } from 'react';
import { SVGIconProps } from '@gryfyn-types/props/SVGIconProps';

export const CopyIcon: FC<SVGIconProps> = ({ width = '16px', height = '16px' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="ContentCopyIcon"
  >
    <path
      d="M13.3333 6.5H7.33333C6.59695 6.5 6 7.09695 6 7.83333V13.8333C6 14.5697 6.59695 15.1667 7.33333 15.1667H13.3333C14.0697 15.1667 14.6667 14.5697 14.6667 13.8333V7.83333C14.6667 7.09695 14.0697 6.5 13.3333 6.5Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33334 10.4997H2.66668C2.31305 10.4997 1.97392 10.3592 1.72387 10.1092C1.47382 9.8591 1.33334 9.51996 1.33334 9.16634V3.16634C1.33334 2.81272 1.47382 2.47358 1.72387 2.22353C1.97392 1.97348 2.31305 1.83301 2.66668 1.83301H8.66668C9.0203 1.83301 9.35944 1.97348 9.60949 2.22353C9.85953 2.47358 10 2.81272 10 3.16634V3.83301"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
