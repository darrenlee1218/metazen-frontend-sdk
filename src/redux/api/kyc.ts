import { createApi } from '@reduxjs/toolkit/query/react';

import { jsonRPCRequestBaseQuery } from '@lib/RTKQueryJRPCBaseQuery';
import { kycClient } from '@services/APIServices/kyc';
import { KYCUserLevelStatusesResult } from '@gryfyn-types/data-transfer-objects/KYCUserLevelStatusesData';

export const kycApi = createApi({
  reducerPath: 'kyc',
  tagTypes: ['kyc'],
  baseQuery: jsonRPCRequestBaseQuery({ client: kycClient }),
  endpoints: (builder) => ({
    generateExternalUserId: builder.query<string, void>({
      query: () => ({ method: 'mtz_kyc_generateExternalUserId' }),
    }),
    getUserLevelStatuses: builder.query<KYCUserLevelStatusesResult, void>({
      query: () => ({ method: 'mtz_kyc_getUserLevelStatuses' }),
    }),
  }),
});

export const {
  useGenerateExternalUserIdQuery,
  useGetUserLevelStatusesQuery,
  reducer: kycReducer,
  middleware: kycMiddleware,
  reducerPath: kycReducerPath,
} = kycApi;

export const { generateExternalUserId } = kycApi.endpoints;
