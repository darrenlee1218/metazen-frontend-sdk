import { signTx } from '@services/APIServices/wallet';
import { CachedJsonRpcProviders } from '@lib/ethers/cached-providers';

interface signData {
  from: string;
  gas: string;
  gasPrice: string;
  to: string;
  value: string;
  chainId: string;
}

interface NodeProviders {
  [chainId: string]: string;
}
const nodeProviders: NodeProviders =
  process.env.REACT_APP_NODE_PROVIDER && JSON.parse(process.env.REACT_APP_NODE_PROVIDER);

export async function sendTxFromApi(signData: signData) {
  const i = 1;
  if (i > 0) {
    // force return.
    return '';
  }
  const chainId = signData.chainId;
  if (chainId === '80001') {
    // Limit only polygon testnet.

    const providerUrl = nodeProviders[chainId ?? ''];
    console.log('SignData', signData);

    const signedTx = await signTx(signData.from, signData);
    const provider = CachedJsonRpcProviders.getInstance(providerUrl);
    const tx = await provider.sendTransaction(signedTx);

    return await tx.wait();
  }
  return '';
}
