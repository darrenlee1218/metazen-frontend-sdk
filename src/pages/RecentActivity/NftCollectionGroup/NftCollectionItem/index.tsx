import React from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { CustomTheme, useTheme } from '@mui/material/styles';

import { useGetAssetMetadataQuery } from '@redux/api/assetMetadataCache';

import RecentActivityItemProps from '@gryfyn-types/props/RecentActivityItemProps';
interface ItemProps {
  data: RecentActivityItemProps;
}

const ItemText = styled(ListItemText)({
  color: 'text.primary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: '2',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  wordBreak: 'normal',
  overflowWrap: 'anywhere',
  paddingRight: 1,
});

export const NftCollectionItem: React.FC<ItemProps> = ({ data }) => {
  const theme = useTheme() as CustomTheme;
  const { data: nftMetadata } = useGetAssetMetadataQuery(
    {
      chainId: data?.chainId,
      contractAddress: data.contractAddress,
      tokenId: data.tokenID,
    },
    { skip: false },
  );

  return (
    <Box
      sx={{ backgroundColor: theme.palette.colors.clickableGray }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
    >
      <ListItemAvatar>
        <a href={data.txUrl} target="_blank" rel="noreferrer">
          <Avatar alt="nft picture" src={nftMetadata?.data?.image} />
        </a>
      </ListItemAvatar>

      <ItemText>
        + {data?.amount} {nftMetadata?.data?.name}
      </ItemText>
    </Box>
  );
};
