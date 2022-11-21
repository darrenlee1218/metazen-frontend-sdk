import ExternalUserIdData from '@gryfyn-types/data-transfer-objects/ExternalUserIdData';
import { KYCUserLevelStatusesResult } from '@gryfyn-types/data-transfer-objects/KYCUserLevelStatusesData';
import { createJRPCClient } from '@lib/JRPCClient';

const REACT_APP_GRYFYN_KYC_API = process.env.REACT_APP_GRYFYN_KYC_API ?? '';

export const kycClient = createJRPCClient(REACT_APP_GRYFYN_KYC_API, 'kyc');

export const generateExternalUserId = async (): Promise<ExternalUserIdData> =>
  kycClient.request('mtz_kyc_generateExternalUserId');

export const getUserLevelStatuses = async (): Promise<KYCUserLevelStatusesResult> =>
  kycClient.request('mtz_kyc_getUserLevelStatuses');

export const ExternalUserIdDataResponse = {
  result: String,
};
