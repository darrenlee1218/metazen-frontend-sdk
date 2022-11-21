import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

import LaunchIcon from '@mui/icons-material/Launch';
import CachedIcon from '@mui/icons-material/Cached';
import SellSharpIcon from '@mui/icons-material/SellSharp';

import { getNftDetailsPageStatus } from '@redux/selector';
import { setRefreshNftDetails } from '@redux/reducer/nftDetailsStatus';
import { assetMetadataCacheServiceEndpoints } from '@redux/api/assetMetadataCache';

import Icon from '@components/Icon';
import ImageTile from '@components/ImageTile';

import Token from '@gryfyn-types/data-transfer-objects/Token';
import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';

import { useSnackbar } from '@lib/snackbar';
import ButtonComponent from '@components/Button';
import { openLinkInNewTab } from '@utils/navigation';
import { getUserAccountLevel } from '@services/APIServices/user-service';
import NftBoosts from './NftBoosts';
import NftProperties from './NftProperties';
import { filterByDisplayType } from './NftCollectionInfoHelper';

interface InputProps {
  nftAssetMetadata: NftAssetMetadata;
  sendNavRoute: string;
  address: string;
  chain: Token['chain'];
}

const GameCollectionInfo: React.FC<InputProps> = ({ nftAssetMetadata, sendNavRoute, address, chain }: InputProps) => {
  const { attributes = [], image = '', description = '' } = nftAssetMetadata.data;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nftAssetProperties, nftAssetBoosts } = filterByDisplayType(attributes);
  const theme = useTheme() as CustomTheme;
  const { contractAddress, chainId, tokenId } = nftAssetMetadata;
  const { forceRefresh } = useSelector(getNftDetailsPageStatus);
  const { enqueueSnackbar } = useSnackbar();

  const onOpenSeaIconClick = (hostUrl: string) => {
    const url = new URL(hostUrl);
    openLinkInNewTab(url.toString());
  };

  const onLaunchExtLinkClick = (hostUrl: string) => {
    const url = new URL(contractAddress, hostUrl);
    url.searchParams.append('a', address);
    openLinkInNewTab(url.toString());
  };

  const checkKycStatusNavigate = async () => {
    try {
      const level = await getUserAccountLevel();
      parseInt(level) > 2 ? navigate(sendNavRoute) : navigate('/page/kyc-reminder');
    } catch (err: any) {
      enqueueSnackbar('Unable to fetch KYC status', { variant: 'error' });
    }
  };

  const onRefreshMetadataClick = () => {
    dispatch(
      setRefreshNftDetails({
        forceRefresh: true,
      }),
    );
    dispatch(
      assetMetadataCacheServiceEndpoints.refreshAssetMetadata.initiate(
        { chainId, contractAddress, tokenId },
        { subscribe: false },
      ),
    );
  };

  return (
    <Box
      sx={{
        margin: '0px 24px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Box
            sx={{
              width: '24px',
              backgroundColor: theme.palette.colors.clickableGray,
              mr: 1,
              textAlign: 'center',
              borderRadius: '3px',
            }}
          >
            <Icon
              IconType={SellSharpIcon}
              sx={{
                backgroundColor: 'transparent',
                objectFit: 'contain',
                p: 0,
                top: '-1px', // to align icon at center pos
              }}
              onClick={() => {
                onOpenSeaIconClick(`https://opensea.io/${address}`);
              }}
            />
          </Box>
          <Box
            sx={{
              width: '24px',
              backgroundColor: theme.palette.colors.clickableGray,
              textAlign: 'center',
              borderRadius: '3px',
            }}
          >
            <Icon
              IconType={LaunchIcon}
              sx={{
                backgroundColor: 'transparent',
                objectFit: 'contain',
                p: 0,
                top: '-1px', // to align icon at center pos
              }}
              onClick={() => {
                onLaunchExtLinkClick(chain.smartContractUrl);
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.colors.clickableGray,
            textAlign: 'center',
            borderRadius: '3px',
            width: '24px',
          }}
        >
          <Icon
            IconType={CachedIcon}
            sx={{
              objectFit: 'contain',
              p: 0,
              backgroundColor: 'transparent',
              top: '-1px', // to align icon at center pos
            }}
            onClick={() => {
              if (!forceRefresh) {
                onRefreshMetadataClick();
              }
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          mt: '8px',
        }}
      >
        <ImageTile
          src={image}
          sx={{
            height: '312px',
            width: '100%',
            minHeight: '312px',
            borderRadius: '3px',
            backgroundSize: 'contain',
          }}
        />
      </Box>
      <Box
        sx={{
          mt: '16px',
        }}
      >
        <ButtonComponent
          fullWidth
          variant="contained"
          onClick={checkKycStatusNavigate}
          sx={{
            borderRadius: '3px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'text.primary',
            bgcolor: theme.palette.colors.clickableGray,
            ':hover': {
              bgcolor: theme.palette.colors.clickableGray,
            },
          }}
        >
          Send
        </ButtonComponent>
      </Box>
      <Box
        sx={{
          mt: 3,
          mb: 2,
        }}
      >
        <Typography variant="h2" fontWeight="600" color="text.primary">
          Description
        </Typography>
        <Typography
          variant="h4"
          color="text.secondary"
          fontWeight="400"
          sx={{
            lineHeight: 'normal',
            marginTop: '8px',
          }}
        >
          {description || 'No Data'}
        </Typography>
      </Box>
      <NftProperties properties={nftAssetProperties} />
      <NftBoosts boosts={nftAssetBoosts} />
    </Box>
  );
};

export default GameCollectionInfo;
