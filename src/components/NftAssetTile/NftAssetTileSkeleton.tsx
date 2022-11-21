import React, { FC } from 'react';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { boxCreator } from '@components/boxCreator';

const SkeletonRoot = boxCreator({
  p: 1,
  borderRadius: 4,
  backgroundColor: (theme) => theme.palette.action.hover,
});

const NftAssetDescriptor = boxCreator({
  mt: 1,
  display: 'flex',
});

export const NftAssetTileSkeleton: FC = () => {
  return (
    <SkeletonRoot>
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 4,
          height: 'unset',
        }}
      />
      <NftAssetDescriptor>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <Skeleton />
        </Typography>
      </NftAssetDescriptor>
    </SkeletonRoot>
  );
};
