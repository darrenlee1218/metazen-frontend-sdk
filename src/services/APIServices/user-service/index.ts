import { createJRPCClient } from '@lib/JRPCClient';

const REACT_APP_METAZENS_USER_SERVICE_API = process.env.REACT_APP_METAZENS_USER_SERVICE_API ?? '';

// https://gitlab.int.hextech.io/metazen/user-service/-/blob/master/api-spec/swagger.yaml
export const userServiceClient = createJRPCClient(REACT_APP_METAZENS_USER_SERVICE_API, 'user-service');

interface UserMFAConfiredResponse {
  mfa: boolean;
}

interface UserGetAccountLevelResponse {
  level: string;
}

export const getUserMFAConfigured = async () => {
  const result = (await userServiceClient.request('user_IsMFAConfigured')) as UserMFAConfiredResponse;

  return result.mfa;
};

export const getUserAccountLevel = async () => {
  const result = (await userServiceClient.request('user_GetUserAccountLevel')) as UserGetAccountLevelResponse;
  return result.level;
};
