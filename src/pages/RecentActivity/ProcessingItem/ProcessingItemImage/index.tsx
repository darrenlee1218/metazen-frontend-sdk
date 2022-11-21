import React from 'react';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { CustomTheme, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';

interface ItemProps {
  url: string;
  standard: TokenStandard;
  nftMetadata?: NftAssetMetadata | null | undefined;
}

export const ProcessingItemImage: React.FC<ItemProps> = ({ url, standard, nftMetadata }) => {
  const theme = useTheme() as CustomTheme;

  switch (true) {
    case url !== '' && ![TokenStandard.ERC721, TokenStandard.ERC1155].includes(standard):
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Avatar
              sx={{
                bgcolor: theme.palette.colors.clickableGray,
                border: `2px solid ${theme.palette.background.paper}`,
                maxWidth: '14px',
                maxHeight: '14px',
              }}
            >
              {<CircularProgress size={8} thickness={8} />}
            </Avatar>
          }
        >
          <Avatar sx={{ maxWidth: '30px', maxHeight: '30px' }} variant={'circular'} src={url} />
        </Badge>
      );
    case url !== '' && [TokenStandard.ERC721, TokenStandard.ERC1155].includes(standard):
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Avatar
              sx={{
                bgcolor: theme.palette.colors.clickableGray,
                border: `2px solid ${theme.palette.background.paper}`,
                maxWidth: '14px',
                maxHeight: '14px',
              }}
            >
              {<CircularProgress size={8} thickness={8} />}
            </Avatar>
          }
        >
          <Avatar
            sx={{ maxWidth: '30px', maxHeight: '30px' }}
            variant={'square'}
            src={nftMetadata?.data?.image ?? ''}
          />
        </Badge>
      );

    default:
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Avatar
              sx={{
                bgcolor: theme.palette.colors.clickableGray,
                border: `2px solid ${theme.palette.background.paper}`,
                maxWidth: '14px',
                maxHeight: '14px',
              }}
            >
              {<CircularProgress size={8} thickness={8} />}
            </Avatar>
          }
        >
          <Avatar sx={{ maxWidth: '30px', maxHeight: '30px' }} src={''} />
        </Badge>
      );
  }
};
