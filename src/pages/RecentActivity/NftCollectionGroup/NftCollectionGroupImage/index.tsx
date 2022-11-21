import React from 'react';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

import { DirectionIcon } from '@pages/RecentActivity/DirectionIcon';

import Token from '@gryfyn-types/data-transfer-objects/Token';

interface ImageProps {
  depositOrWithdrawal: string;
  status: string;
  token: Token | undefined;
}

export const NftCollectionGroupImage: React.FC<ImageProps> = ({ depositOrWithdrawal, status, token }) => {
  switch (true) {
    case token?.display.nftCollectionImageUrl !== '':
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<DirectionIcon status={status} depositOrWithdrawal={depositOrWithdrawal} />}
        >
          <Avatar variant="square" src={token?.display.nftCollectionImageUrl} />
        </Badge>
      );
    case token?.display.nftCollectionBackgroundImageUrl !== '':
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<DirectionIcon status={status} depositOrWithdrawal={depositOrWithdrawal} />}
        >
          <Avatar variant="square" src={token?.display.nftCollectionBackgroundImageUrl} />
        </Badge>
      );
    case token?.display.pngIconUrl !== '':
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<DirectionIcon status={status} depositOrWithdrawal={depositOrWithdrawal} />}
        >
          <Avatar variant="square" src={token?.display.pngIconUrl} />
        </Badge>
      );
    default:
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<DirectionIcon status={status} depositOrWithdrawal={depositOrWithdrawal} />}
        >
          <Avatar src={''} />
        </Badge>
      );
  }
};
