import { CachedJsonRpcProviders } from '@lib/ethers/cached-providers';
import { useQuery } from '@tanstack/react-query';
import { utils } from 'ethers';
import { useMemo } from 'react';

// Reference: https://github.com/ethers-io/ethers.js/discussions/3084
const validateContractAddress = async (address: string, providerUrl: string) => {
  const provider = CachedJsonRpcProviders.getInstance(providerUrl);
  const code = await provider.getCode(address);

  return code !== '0x';
};

export const useIsContractAddress = (address: string | undefined, providerUrl: string) => {
  const isValidAddress = useMemo(() => utils.isAddress(address ?? ''), [address]);
  const { isLoading, data: isContractAddress } = useQuery(
    ['ethereum-address', address, providerUrl],
    () => {
      return validateContractAddress(address!, providerUrl);
    },
    {
      staleTime: Infinity,
      enabled: isValidAddress,
    },
  );

  return useMemo(
    () => ({
      isLoading,
      isContractAddress,
      isValidAddress,
    }),
    [isContractAddress, isLoading, isValidAddress],
  );
};
