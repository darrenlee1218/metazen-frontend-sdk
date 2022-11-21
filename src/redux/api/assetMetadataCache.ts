import { createApi } from '@reduxjs/toolkit/query/react';

import { jsonRPCRequestBaseQuery } from '@lib/RTKQueryJRPCBaseQuery';
import { assetMetadataCacheServiceClient } from '@services/APIServices/asset-metadata-cache-service';
import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';

import { NftAssetMetadataResponse } from '@services/APIServices/asset-metadata-cache-service/NftAssetMetadataResponse';

type GetAssetMetadataBatchParams = GetAssetMetadataParams[];

export interface GetAssetMetadataParams {
  chainId: string | void;
  contractAddress: string | void;
  tokenId: string | void;
}

const transformAssetMetadataResponse = (response: NftAssetMetadataResponse): NftAssetMetadata => ({
  symbol: response.symbol ?? '',
  chainId: response.chainId ?? '',
  contractAddress: response.contractAddress ?? '',
  owner: response.owner ?? '',
  tokenId: response.tokenId ?? '',
  tokenStandard: response.tokenStandard ?? '',
  createdTime: response.createdTime ?? '',
  updatedTime: response.updatedTime ?? '',
  data: JSON.parse(response.data ?? '{}'),
});

export const assetMetadataCacheServiceApi = createApi({
  reducerPath: 'assetMetadataCacheService',
  baseQuery: jsonRPCRequestBaseQuery({ client: assetMetadataCacheServiceClient }),
  endpoints: (builder) => ({
    getAssetMetadata: builder.query<NftAssetMetadata | null, GetAssetMetadataParams>({
      query: (assetDetails) => ({ method: 'mtz_asset_metadata_cache_GetAssetMetadata', params: assetDetails }),
      transformResponse: (response: NftAssetMetadataResponse | null) => {
        if (response == null) return null;
        return transformAssetMetadataResponse(response);
      },
    }),

    refreshAssetMetadata: builder.query<null, GetAssetMetadataParams>({
      query: (assetDetails) => ({
        method: 'mtz_asset_metadata_cache_UpdateAssetMetadata',
        params: assetDetails,
      }),
    }),

    getAssetMetadataBatch: builder.query<NftAssetMetadata[] | null, GetAssetMetadataBatchParams>({
      query: (params) => ({ method: 'mtz_asset_metadata_cache_GetAssetMetadataBatch', params }),
      transformResponse: (response: NftAssetMetadataResponse[] | null) =>
        response?.map((res) => transformAssetMetadataResponse(res)) ?? null,
    }),
  }),
});

export const {
  useGetAssetMetadataQuery,
  useRefreshAssetMetadataQuery,
  useGetAssetMetadataBatchQuery,
  reducer: assetMetadataCacheServiceReducer,
  endpoints: assetMetadataCacheServiceEndpoints,
  middleware: assetMetadataCacheServiceMiddleware,
  reducerPath: assetMetadataCacheServiceReducerPath,
} = assetMetadataCacheServiceApi;
