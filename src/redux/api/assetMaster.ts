import { createApi } from '@reduxjs/toolkit/query/react';

import { jsonRPCRequestBaseQuery } from '@lib/RTKQueryJRPCBaseQuery';
import { assetMasterClient } from '@services/APIServices/asset-master-service';

import Token, { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import { AssetMasterGetAssetResponse } from '@services/APIServices/asset-master-service/AssetMasterGetAssetResponse';

export const assetMasterApi = createApi({
  reducerPath: 'assetMaster',
  baseQuery: jsonRPCRequestBaseQuery({ client: assetMasterClient }),
  endpoints: (builder) => ({
    getTokens: builder.query<Token[], void>({
      query: () => ({ method: 'assetMaster_getAssets' }),
      transformResponse: (response: AssetMasterGetAssetResponse) => {
        const transformedNativeTokens = Object.values(response.data)
          .map(({ native, tokens, network, ...chain }) => ({ chain, network, ...native }))
          .map<Token>((tokenResponse) => ({
            ...tokenResponse,
            txUrl: tokenResponse.chain.txUrl,
            isNative: true,
            standard: TokenStandard.NATIVE,
            contractAddress: undefined,
          }));

        const transformedNonNativeTokens = Object.values(response.data)
          .flatMap(({ native, tokens, network, ...chain }) =>
            Object.values(tokens ?? {}).map((token) => ({ chain, network, ...token })),
          )
          .map<Token>(({ metadata, ...tokenResponse }) => ({
            ...tokenResponse,
            ...metadata,
            txUrl: tokenResponse.chain.txUrl,
            isNative: false,
            standard: tokenResponse.standard as TokenStandard,
            contractAddress: tokenResponse.contractAddress,
          }));

        return transformedNativeTokens.concat(transformedNonNativeTokens);
      },
    }),
  }),
});

export const {
  useGetTokensQuery,
  reducer: assetMasterReducer,
  endpoints: assetMasterEndpoints,
  middleware: assetMasterMiddleware,
  reducerPath: assetMasterReducerPath,
} = assetMasterApi;
