import { userJrpcClient } from './clients';

interface UserAccountLevelDto {
  accountDisabled: boolean;
  level: string; // 1, 2, 3...
}

enum UserJrpcMethods {
  IsMFAConfigured = 'user_IsMFAConfigured',
  GetUserAccountLevel = 'user_GetUserAccountLevel',
}

export const userApi = {
  getUserAccountLevel: async (): Promise<UserAccountLevelDto> => {
    return userJrpcClient.request(UserJrpcMethods.GetUserAccountLevel);
  },
  getUserMFAConfigured: async (): Promise<boolean> => {
    const res = await userJrpcClient.request(UserJrpcMethods.IsMFAConfigured);

    return res.mfa === 'true';
  },
};

export const userQueryKeys = {
  getLevels: () => [UserJrpcMethods.GetUserAccountLevel],
  isMFAConfigured: () => [UserJrpcMethods.IsMFAConfigured],
};
