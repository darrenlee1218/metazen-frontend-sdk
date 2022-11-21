import { useGetTokensQuery } from '@redux/api/assetMaster';
import { useMemo } from 'react';

export const useTokenByKey = (key: string) => {
  const { tokenByKey } = useGetTokensQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      tokenByKey: (tokenKey: string) => result.data?.find((token) => token.key === tokenKey) ?? null,
    }),
  });

  return useMemo(() => tokenByKey(key), [key, tokenByKey]);
};
