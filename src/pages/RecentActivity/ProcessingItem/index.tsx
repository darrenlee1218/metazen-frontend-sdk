import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/system';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import { CustomTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import { checkHexValue, roundDigit } from '@utils/tx-history';
import { BuiltTx } from '@services/APIServices/tx-builder/types';
import SendToken from '@gryfyn-types/data-transfer-objects/SendToken';
import { useGetAssetMetadataQuery } from '@redux/api/assetMetadataCache';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import { getValueSentFromData } from '@services/APIServices/tx-builder/decode';
import { TPendingTxOperation } from '@gryfyn-types/props/PendingTransactionProps';

import { ProcessingItemImage } from './ProcessingItemImage';

interface ItemProps {
  id: string;
  data: SendToken;
  tx: BuiltTx;
  changeOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  changePortalType: React.Dispatch<React.SetStateAction<TPendingTxOperation>>;
  changeModalChainId: React.Dispatch<React.SetStateAction<string>>;
  nftId: string;
  txUrl?: string;
}

const ItemText = styled(ListItemText)({
  fontWeight: '500',
  color: 'text.primary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: '2',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  wordBreak: 'normal',
  overflowWrap: 'anywhere',
});

const SpeedUpBtn = styled(Button)({
  minHeight: 0,
  padding: 0,
  minWidth: '70px',
  paddingTop: '-6px',
  '&.MuiButtonBase-root:hover': {
    background: 'transparent',
    textTransform: 'none',
  },
  fontSize: '12px',
  textTransform: 'none',
});

const CancelBtn = styled(Button)({
  minHeight: 0,
  padding: 0,
  '&.MuiButtonBase-root:hover': {
    background: 'transparent',
    textTransform: 'none',
  },
  textTransform: 'none',
  fontSize: '12px',
  color: '#8A9296',
  marginRight: '-12px',
});

const ItemAvatar = styled(ListItemAvatar)({
  marginRight: '-12px',
});

const ItemListContainer = styled(ListItem)(({ theme }) => ({
  backgroundColor: (theme as CustomTheme).palette.colors.clickableGray,
  borderRadius: 3,
  '&:hover': {
    backgroundColor: theme.palette.colors.clickableGrayHover,
  },
}));

export const ProcessingItem: React.FC<ItemProps> = ({
  id,
  data,
  tx,
  changeOpenState,
  changePortalType,
  changeModalChainId,
  nftId,
  txUrl,
}) => {
  const { data: nftMetadata } = useGetAssetMetadataQuery(
    {
      chainId: data?.chainId,
      contractAddress: data?.contractAddress,
      tokenId: nftId,
    },
    { skip: ![TokenStandard.ERC721, TokenStandard.ERC1155].includes(data.standard) },
  );

  const [showOut, setShowOut] = useState(false);
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setShowOut(true);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, []);

  const amount = (standard: string, value: string): string => {
    switch (true) {
      case standard === TokenStandard.NATIVE:
      case standard === TokenStandard.ERC20:
        return roundDigit(ethers.utils.formatUnits(checkHexValue(value), data.decimals), 4);
      case standard === TokenStandard.ERC721:
        return '1';
      default:
        return '1';
    }
  };

  const itemText = (standard: string) => {
    switch (true) {
      case standard === TokenStandard.ERC1155:
      case standard === TokenStandard.ERC721:
        return nftMetadata?.data.name;
      default:
        return data.tokenAssetTicker;
    }
  };

  return (
    <List sx={{ mr: '24px', ml: '24px', paddingLeft: 0, paddingRight: 0 }}>
      <ItemListContainer
        key={data.fromAddress}
        // component="div"
      >
        <Link href={txUrl?.concat(id)} target="_blank" rel="noreferrer" color="inherit" underline="none">
          <ItemAvatar>
            <ProcessingItemImage url={data.icon} standard={data.standard} nftMetadata={nftMetadata} />
          </ItemAvatar>
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Link
            sx={{ flexGrow: 1 }}
            href={txUrl?.concat(id)}
            target="_blank"
            rel="noreferrer"
            color="inherit"
            underline="none"
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.standard === TokenStandard.ERC721 ? (
                <ItemText disableTypography primary={`Sending ${1} ${itemText(data.standard)}`} />
              ) : (
                <ItemText
                  disableTypography
                  primary={`Sending ${amount(data.standard, getValueSentFromData(tx, data.standard))} ${itemText(
                    data.standard,
                  )}`}
                />
              )}
            </div>
          </Link>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '-6px',
            }}
          >
            <ListItemText
              disableTypography
              style={{ color: '#8a9296', minWidth: '100px', fontSize: '12px' }}
              secondary={'Pending'}
            />
            <div style={{ display: 'flex' }}>
              {showOut ? (
                <SpeedUpBtn
                  variant="text"
                  sx={{ ml: '16px' }}
                  onClick={() => {
                    changeOpenState(true);
                    changePortalType(TPendingTxOperation.Speedup);
                    changeModalChainId(id);
                  }}
                  disableElevation
                  disableRipple
                >
                  Speed up
                </SpeedUpBtn>
              ) : (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width={'70px'}
                  sx={{ ml: '16px', borderRadius: '1px' }}
                />
              )}

              <CancelBtn
                variant="text"
                onClick={() => {
                  changeOpenState(true);
                  changePortalType(TPendingTxOperation.Cancel);
                  changeModalChainId(id);
                }}
                disableElevation
                disableRipple
              >
                Cancel
              </CancelBtn>
            </div>
          </div>
        </div>
      </ItemListContainer>
    </List>
  );
};
