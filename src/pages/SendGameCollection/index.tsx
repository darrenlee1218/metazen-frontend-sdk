import React, { FC, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { boxCreator } from '@components/boxCreator';
import BackNavigation from '@components/BackNavigation';
import { ProceduralFooter } from '@components/ProceduralFooter';

import { useTokenByKey } from '@hooks/useTokenByKey';
import { useGetBalancesByAssetIdsQuery } from '@redux/api/bookKeeping';

import { NftTokenTile } from './NftTokenTile';

const Root = boxCreator({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
});

export const SendGameCollection: FC = () => {
  const { key: collectionKey = '' } = useParams<{ key: string }>();
  const { search } = useLocation();
  const selectedTokenId = new URLSearchParams(search).get('selected');
  const navigate = useNavigate();

  const nftCollectionToken = useTokenByKey(collectionKey);
  const { data: nftTokens = [] } = useGetBalancesByAssetIdsQuery(
    {
      assetIds: [collectionKey],
    },
    { skip: !collectionKey },
  );

  const handleSelectNft = useCallback(
    (nftTokenId: string | null) => {
      navigate(
        {
          search: nftTokenId ? `?selected=${nftTokenId}` : '',
        },
        {
          replace: true,
        },
      );
    },
    [navigate],
  );

  const handleNext = useCallback(() => {
    navigate({
      pathname: `/page/game-collection/${collectionKey}/items/${selectedTokenId}/send`,
    });
  }, [collectionKey, navigate, selectedTokenId]);

  if (!nftCollectionToken) {
    console.error(`Could not find token with key: ${collectionKey}`);
    return null;
  }

  return (
    <Root>
      <BackNavigation label="Send NFT" onBackPress={() => navigate(-1)} />
      <Typography sx={{ py: 1, fontSize: 10 }} align="center" variant="body2" color="text.secondary">
        Select which item you would like to send.
        <br />
        Only 1 item can be choosen.
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{
          flexGrow: 1,
          px: 3,
          pt: 2,
          pb: 4,
        }}
      >
        {nftTokens.map((nftToken) => (
          <Grid key={nftToken.nftTokenId} item xs={4}>
            <NftTokenTile
              collectionContractAddress={nftCollectionToken.contractAddress ?? ''}
              isSelected={nftToken.nftTokenId === selectedTokenId}
              nftToken={nftToken}
              onClick={handleSelectNft}
            />
          </Grid>
        ))}
      </Grid>
      <ProceduralFooter
        isLoading={false}
        requireDivider
        onAdvance={handleNext}
        isAdvanceEnabled={Boolean(selectedTokenId)}
      />
    </Root>
  );
};
