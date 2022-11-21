import React from 'react';
import GameCollectionDetails from '@components/GameCollectionDetails';
import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';
import Token from '@gryfyn-types/data-transfer-objects/Token';

interface InputProps {
  nftAssetMetadata: NftAssetMetadata;
  sendNavRoute: string;
  address: string;
  chain: Token['chain'];
}
const GameCollectionDetailsContainer: React.FC<InputProps> = ({
  nftAssetMetadata,
  sendNavRoute,
  address,
  chain,
}: InputProps) => (
  <GameCollectionDetails
    nftAssetMetadata={nftAssetMetadata}
    sendNavRoute={sendNavRoute}
    address={address}
    chain={chain}
  />
);

export default GameCollectionDetailsContainer;
