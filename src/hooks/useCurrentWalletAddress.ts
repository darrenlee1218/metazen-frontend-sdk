import { getAddresses } from '@services/APIServices/wallet';
import { networkVersion } from '@services/web3/web3-api-service/walletNetworkVersion';
import { useQuery } from '@tanstack/react-query';

interface PropsType {
  walletAddress: string | null;
  isLoadWalletAddressError: boolean;
}

export const useCurrentWalletAddress = (chainId: string | undefined): PropsType => {
  const { data: addressResponse, isError: isLoadWalletAddressError } = useQuery(
    ['mtz_wallet_getOrCreateAddresses', chainId],
    async () => getAddresses(chainId),
    {
      enabled: Boolean(chainId),
    },
  );
  // set wallet chainId as deposit chainId is changed
  // side effect is added, should be merge to 1 single control variable
  networkVersion.setNetwork(<string>chainId);
  return { walletAddress: addressResponse?.[0].address ?? null, isLoadWalletAddressError };
};
