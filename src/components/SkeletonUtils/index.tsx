import React, { FC, ReactElement, ReactNode } from 'react';

import Skeleton, { SkeletonProps } from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';

import { Loadable } from '@gryfyn-types/generics';

interface SkeletonIfLoadingProps extends SkeletonProps {
  loadableContent: Loadable<unknown>;
  children: ReactElement;
}

export const SkeletonWrapper: FC<SkeletonIfLoadingProps> = ({ loadableContent, children, ...props }) => {
  return loadableContent === undefined ? <Skeleton {...props}>{children}</Skeleton> : <>{children}</>;
};

interface SkeletonTypographyProps extends TypographyProps {
  loadableContent: Loadable<unknown>;
  skeletonProps?: SkeletonProps;
  children: ReactNode;
}

const SkeletonTypography: FC<SkeletonTypographyProps> = ({ loadableContent, skeletonProps, children, ...props }) => {
  return (
    <Typography {...props}>{loadableContent === undefined ? <Skeleton {...skeletonProps} /> : children}</Typography>
  );
};

export const SkeletonUtils = {
  Wrapper: SkeletonWrapper,
  Typography: SkeletonTypography,
};
