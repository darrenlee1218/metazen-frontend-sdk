import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { getAddresses } from '@services/APIServices/wallet';
import { selectSupportedNetworks } from '@redux/selector';

export const useWalletInitial = () => {
  const [isLoading, setIsLoading] = useState(true);

  const supportedNetworks = useSelector(selectSupportedNetworks);

  useEffect(() => {
    // make a call to `getAddress` to jrpc-wallet to trigger a creation of WOA if it is not existed yet
    // for current user.
    // Here is a temporary solution to make sure listener can capture transactions even when
    // users deposit to wrong network but also supported in gryfyn.
    // this logic should move to `Web3Wallet` when we are drop out the `demo` method to open gryfyn wallet,
    // and emit message back to the provider's `getAccounts` call.
    setIsLoading(true);
    if (!supportedNetworks.length) {
      setIsLoading(false);
      return;
    }

    (async () => {
      for await (const chainId of supportedNetworks) {
        try {
          await getAddresses(chainId);
          // for now we only "make a fetch" to trigger jrpc-wallet to create EOA for users.
          // until we integrate with Web3Wallet the success or failed state should emit response message.
        } catch (err) {
          console.error('getAddresses failed', err);
        }
      }
      setIsLoading(false);
    })();
  }, supportedNetworks);

  return isLoading;
};
