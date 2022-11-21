import React from 'react';
import { Box } from '@mui/material';
import GameCollectionDetailsHeader from '@components/GameCollectionDetailsHeader';
import GameCollectionInfo from '@components/GameCollectionInfo';
import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';
import Token from '@gryfyn-types/data-transfer-objects/Token';

interface InputProps {
  nftAssetMetadata: NftAssetMetadata;
  sendNavRoute: string;
  address: string;
  chain: Token['chain'];
}

const GameCollectionDetails: React.FC<InputProps> = ({
  nftAssetMetadata,
  sendNavRoute,
  address,
  chain,
}: InputProps) => {
  const nftTitle = nftAssetMetadata?.data ? nftAssetMetadata.data.name : '';
  return (
    <Box
      sx={{
        gap: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GameCollectionDetailsHeader nftTitle={nftTitle} />
      <GameCollectionInfo
        nftAssetMetadata={nftAssetMetadata}
        sendNavRoute={sendNavRoute}
        address={address}
        chain={chain}
      />
    </Box>
  );
};

export default GameCollectionDetails;
