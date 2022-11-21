import { createApi } from '@reduxjs/toolkit/query/react';

import { API_CONSTANTS } from '@constants/api';
import { jsonRPCRequestBaseQuery } from '@lib/RTKQueryJRPCBaseQuery';
import { bookkeepingClient } from '@services/APIServices/book-keeping';

import BalanceData from '@gryfyn-types/data-transfer-objects/BalanceData';
import NftTokenData from '@gryfyn-types/data-transfer-objects/NftTokenData';

export interface GetBalancesByAssetIdsParams {
  assetIds: string[];
  aggregateNfts?: boolean;
}

export const bookKeepingApi = createApi({
  reducerPath: 'bookKeeping',
  tagTypes: ['bookKeeping'],
  refetchOnMountOrArgChange: API_CONSTANTS.ASSET_POLLING_INTERVAL_S,
  baseQuery: jsonRPCRequestBaseQuery({ client: bookkeepingClient }),
  endpoints: (builder) => ({
    getBalances: builder.query<BalanceData[], void>({
      query: () => ({ method: 'mtz_bk_GetBalancesRequest' }),
    }),
    getBalancesByAssetIds: builder.query<NftTokenData[], GetBalancesByAssetIdsParams>({
      query: (assetDetails) => ({ method: 'mtz_bk_GetBalancesByAssetIdsRequest', params: assetDetails }),
    }),
  }),
});

export const {
  useGetBalancesQuery,
  useGetBalancesByAssetIdsQuery,
  reducer: bookKeepingReducer,
  middleware: bookKeepingMiddleware,
  reducerPath: bookKeepingReducerPath,
} = bookKeepingApi;

export const { getBalances } = bookKeepingApi.endpoints;
