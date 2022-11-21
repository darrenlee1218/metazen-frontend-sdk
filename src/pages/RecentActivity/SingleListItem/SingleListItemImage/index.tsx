import React from 'react';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

import { DirectionIcon } from '@pages/RecentActivity/DirectionIcon';

import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';

interface ImageProps {
  iconUrl: string;
  spec: string;
  status: string;
  depositOrWithdrawal: string;
  nftMetadata: NftAssetMetadata | null | undefined;
}

export const SingeListItemImage: React.FC<ImageProps> = ({
  iconUrl,
  spec,
  status,
  depositOrWithdrawal,
  nftMetadata,
}) => {
  switch (true) {
    case iconUrl !== '' && spec !== 'ERC-721' && spec !== 'ERC-1155':
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<DirectionIcon status={status} depositOrWithdrawal={depositOrWithdrawal} />}
        >
          <Avatar sx={{ maxWidth: '30px', maxHeight: '30px' }} src={iconUrl} />
        </Badge>
      );
    case spec === 'ERC-721':
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<DirectionIcon status={status} depositOrWithdrawal={depositOrWithdrawal} />}
        >
          <Avatar
            variant="square"
            sx={{ maxWidth: '30px', maxHeight: '30px', borderRadius: 4 }}
            src={nftMetadata?.data?.image}
          />
        </Badge>
      );
    case spec === 'ERC-1155':
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<DirectionIcon status={status} depositOrWithdrawal={depositOrWithdrawal} />}
        >
          <Avatar
            variant="square"
            sx={{ background: 'green', maxWidth: '30px', maxHeight: '30px', borderRadius: 4 }}
            src={nftMetadata?.data?.image}
          />
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
