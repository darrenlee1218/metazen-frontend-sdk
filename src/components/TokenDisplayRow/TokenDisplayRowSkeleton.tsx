import React, { FC } from 'react';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { TokenIcon } from '@components/TokenIcon';
import { boxCreator } from '@components/boxCreator';

const SkeletonRoot = boxCreator({
  p: 2,
  display: 'grid',
  gridTemplateColumns: '40px minmax(0, 1fr)',
  gap: 1.5,
  alignItems: 'center',
  borderRadius: 4,
  backgroundColor: (theme) => theme.palette.action.hover,
});

const TokenDetailBox = boxCreator({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const TokenDetailRow = boxCreator({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: 0,
  gap: 2,
});

export const TokenDisplayRowSkeleton: FC = () => {
  return (
    <SkeletonRoot>
      <Skeleton variant="circular">
        <TokenIcon isNative={false} tokenIconUrl="" networkIconUrl="" />
      </Skeleton>

      <TokenDetailBox>
        <TokenDetailRow>
          <Typography component="div" variant="h2" sx={{ flexGrow: 1 }}>
            <Skeleton />
          </Typography>

          <Typography component="div" variant="h2" sx={{ flexGrow: 1 }}>
            <Skeleton />
          </Typography>
        </TokenDetailRow>

        <TokenDetailRow>
          <Typography component="div" variant="h2" sx={{ flexGrow: 1 }}>
            <Skeleton />
          </Typography>

          <Typography component="div" variant="h2" sx={{ flexGrow: 1 }}>
            <Skeleton />
          </Typography>
        </TokenDetailRow>
      </TokenDetailBox>
    </SkeletonRoot>
  );
};
