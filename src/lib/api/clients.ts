import { createJRPCClient } from '@lib/JRPCClient';

import { AxiosEventClient } from './axios-event-client';

export const kycJrpcClient = createJRPCClient(process.env.REACT_APP_GRYFYN_KYC_API!, 'kyc');

export const userJrpcClient = createJRPCClient(process.env.REACT_APP_METAZENS_USER_SERVICE_API!, 'user-service');

export const kycAxiosClient = new AxiosEventClient(
  'kyc-axios-client',
  {
    baseURL: process.env.REACT_APP_KYC_API_URL,
    withCredentials: true,
  },
  (error) => {
    if (!error.response?.data) return null;
    const typedData = error.response?.data as Partial<{ errors: [{ message: string }] | string }>;
    if (Array.isArray(typedData.errors)) return typedData.errors[0].message;

    return typedData.errors ?? null;
  },
);
