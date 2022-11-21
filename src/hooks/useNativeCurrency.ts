import Token from '@gryfyn-types/data-transfer-objects/Token';
import { useGetTokensQuery } from '@redux/api/assetMaster';

export const useNativeCurrency = (chainId: string | null | undefined): Token | null => {
  const { getNativeToken } = useGetTokensQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      getNativeToken: () => result.data?.find((token) => token.chain.chainID === chainId && token.isNative) ?? null,
    }),
  });

  if (!chainId) return null;
  return getNativeToken();
};
