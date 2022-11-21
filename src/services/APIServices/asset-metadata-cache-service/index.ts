import { createJRPCClient } from '@lib/JRPCClient';
import { NftAssetMetadataResponse } from './NftAssetMetadataResponse';

const REACT_APP_METAZENS_ASSET_METADATA_CACHE_API = process.env.REACT_APP_METAZENS_ASSET_METADATA_CACHE_API ?? '';
export const assetMetadataCacheServiceClient = createJRPCClient(
  REACT_APP_METAZENS_ASSET_METADATA_CACHE_API,
  'asset-metadata-cache',
);

export const getAssetMetadata = async (): Promise<NftAssetMetadataResponse> =>
  assetMetadataCacheServiceClient.request('mtz_asset_metadata_cache_GetAssetMetadata', {
    chainId: '80001',
    contractAddress: '0xa1a6bbb60bf86bd70060a303debe4633726cda55',
    tokenId: '107',
  });
