import React from 'react';

import { styled } from '@mui/system';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { CustomTheme, useTheme } from '@mui/material/styles';

import { formatTxHistoryTime } from '@utils/format';
import { useGetAssetMetadataQuery } from '@redux/api/assetMetadataCache';
import RecentActivityItemProps from '@gryfyn-types/props/RecentActivityItemProps';

import { PrimaryText } from './PrimaryText';
import { SecondaryText } from './SecondaryText';
import { SingeListItemImage } from './SingleListItemImage';

interface ItemProps {
  data: RecentActivityItemProps;
}

const Item = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.colors.clickableGray,
  borderRadius: 3,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme.palette.colors.clickableGrayHover,
  },
}));

const ItemText = styled(ListItemText)({
  fontWeight: '600',
  color: 'text.primary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: '2',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  wordBreak: 'normal',
  overflowWrap: 'anywhere',
});

const ItemAvatar = styled(ListItemAvatar)({
  minHeight: 32,
  minWidth: 32,
  marginRight: '12px',
});

export const SingleListItem: React.FC<ItemProps> = ({ data }) => {
  const theme = useTheme() as CustomTheme;

  const {
    tokenID,
    contractAddress,
    chainId,
    assetName,
    assetKey,
    txUrl,
    iconUrl,
    status,
    depositOrWithdrawal,
    spec,
    primaryStatus,
    amount,
    from,
    to,
    when,
  } = data;

  const { data: nftMetadata } = useGetAssetMetadataQuery(
    {
      chainId,
      contractAddress,
      tokenId: tokenID,
    },
    { skip: !['ERC-721', 'ERC-1155'].includes(spec) },
  );

  return (
    <Link href={txUrl} target="_blank" rel="noreferrer" color="inherit" underline="none">
      <Item key={assetName}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ItemAvatar sx={{ minHeight: '24px', minWidth: '24px' }}>
            <SingeListItemImage
              iconUrl={iconUrl}
              status={status}
              depositOrWithdrawal={depositOrWithdrawal}
              spec={spec}
              nftMetadata={nftMetadata}
            />
          </ItemAvatar>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
            <ItemText
              disableTypography
              primary={
                <PrimaryText
                  status={primaryStatus}
                  amount={amount}
                  assetKey={assetKey}
                  spec={spec}
                  nftMetadata={nftMetadata}
                />
              }
            />
            <SecondaryText from={from} to={to} depositOrWithdrawal={depositOrWithdrawal} />
          </div>
        </div>
        <div>
          <ListItemText
            secondaryTypographyProps={{
              marginTop: status === 'Completed' ? '0px' : '10px',
              marginBottom: status === 'Completed' ? '0px' : '4px',
              textAlign: 'right',
              minWidth: 60,
              fontSize: '12px',
            }}
            secondary={formatTxHistoryTime(when)}
          />
          {status !== 'Completed' && (
            <ListItemText
              disableTypography
              sx={{
                textTransform: 'capitalize',
                color:
                  status === 'Declined' || status === 'Failed'
                    ? theme.palette.colors.errorPrimary
                    : status === 'Frozen'
                    ? theme.palette.colors.warningPrimary
                    : theme.palette.common.white,
                textAlign: 'right',
                minWidth: 60,
                fontSize: '12px',
              }}
              secondary={status}
            />
          )}
        </div>
      </Item>
    </Link>
  );
};
