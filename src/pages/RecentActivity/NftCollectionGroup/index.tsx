import React, { useState } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { styled, CustomTheme, useTheme } from '@mui/material/styles';

import { formatTxHistoryTime } from '@utils/format';
import { useGetTokensQuery } from '@redux/api/assetMaster';
import Token from '@gryfyn-types/data-transfer-objects/Token';
import RecentActivityItemProps from '@gryfyn-types/props/RecentActivityItemProps';

import { NftCollectionItem } from './NftCollectionItem';
import { SecondaryText } from '../SingleListItem/SecondaryText';
import { NftCollectionGroupImage } from './NftCollectionGroupImage';

interface LayoutProps {
  data: RecentActivityItemProps[];
  openFunction?: () => void;
  openState?: boolean;
}

const ItemText = styled(ListItemText)({
  color: 'text.primary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: '2',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  maxWidth: '180px',
  wordBreak: 'normal',
  overflowWrap: 'anywhere',
});

const ItemAvatar = styled(ListItemAvatar)({
  minHeight: 40,
  minWidth: 40,
  marginRight: '12px',
});

export const NftCollectionGroup: React.FC<LayoutProps> = ({ data }) => {
  const theme = useTheme() as CustomTheme;
  const { assetKey, status, depositOrWithdrawal, to, from, when } = data[0];
  const [openState, setOpenState] = useState(false);
  const tokenData = useGetTokensQuery();
  const tokenSpecificDetails = tokenData.data?.find((element: Token) => element.key === assetKey);

  const openFunction = () => {
    setOpenState(!openState);
  };

  return (
    <>
      <ListItemButton
        onClick={openFunction}
        sx={{ borderRadius: 4, backgroundColor: theme.palette.colors.clickableGray }}
      >
        {/* tokenSpecificDetails */}
        <ItemAvatar>
          <NftCollectionGroupImage
            status={status}
            depositOrWithdrawal={depositOrWithdrawal}
            token={tokenSpecificDetails}
          />
        </ItemAvatar>
        <div style={{ display: 'table-column', minWidth: 180 }}>
          <ItemText primary={`${data[0].primaryStatus} ${data?.length} ${tokenSpecificDetails?.displayName}`} />
          <SecondaryText from={from} to={to} depositOrWithdrawal={depositOrWithdrawal} />
        </div>
        <Box display="column" justifyContent={'flex-end'} textAlign={'center'}>
          <ListItemText style={{ minWidth: 48, textAlign: 'right' }} secondary={formatTxHistoryTime(when)} />
          <Box style={{ marginLeft: '10px' }}>{openState ? <ExpandLess /> : <ExpandMore />}</Box>
        </Box>
      </ListItemButton>
      <Collapse in={openState} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {data.map((item: RecentActivityItemProps) => {
            return <NftCollectionItem data={item} key={item.hash} />;
          })}
        </List>
      </Collapse>
    </>
  );
};
