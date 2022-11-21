import { createApi } from '@reduxjs/toolkit/query/react';

import { API_CONSTANTS } from '@constants/api';
import { jsonRPCRequestBaseQuery } from '@lib/RTKQueryJRPCBaseQuery';
import TokenPrice from '@gryfyn-types/data-transfer-objects/TokenPrice';
import { assetevaluatorClient } from '@services/APIServices/asset-evaluator';

const assetEvaluatorApi = createApi({
  reducerPath: 'assetEvaluator',
  refetchOnMountOrArgChange: API_CONSTANTS.ASSET_POLLING_INTERVAL_S,
  baseQuery: jsonRPCRequestBaseQuery({ client: assetevaluatorClient }),
  endpoints: (builder) => ({
    getPrices: builder.query<TokenPrice[], string[]>({
      query: (assetKeys) => ({ method: 'mtz_evaluatorGetPrices', params: assetKeys }),
    }),
  }),
});

export const {
  useGetPricesQuery,
  reducer: assetEvaluatorReducer,
  middleware: assetEvaluatorMiddleware,
  reducerPath: assetEvaluatorReducerPath,
} = assetEvaluatorApi;
