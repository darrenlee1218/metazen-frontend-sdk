import { createJRPCClient } from '@lib/JRPCClient';
import { AssetMasterGetAssetResponse } from './AssetMasterGetAssetResponse';

const REACT_APP_METAZENS_ASSET_MASTER_API = process.env.REACT_APP_METAZENS_ASSET_MASTER_API ?? '';
export const assetMasterClient = createJRPCClient(REACT_APP_METAZENS_ASSET_MASTER_API, 'asset-master');

export const getAssets = async (): Promise<AssetMasterGetAssetResponse> =>
  assetMasterClient.request('assetMaster_getAssets');
