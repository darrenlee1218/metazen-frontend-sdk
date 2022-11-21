import { JSONRPCClient } from 'json-rpc-2.0';
import { EIP712TypedData } from '@gryfyn-types/data-transfer-objects/EIP712TypedData';
import { JrpcWalletAddress } from '@gryfyn-types/data-transfer-objects/JrpcWalletAddress';

import { createJRPCClient } from '@lib/JRPCClient';
import { networkVersion } from '@services/web3/web3-api-service/walletNetworkVersion';

import { SignTxPendingResponse, loopFetching, SignTxStatus } from './loopFetching';

// temp type define, please change to proper location if any dislike

const REACT_APP_METAZENS_WALLET_API = process.env.REACT_APP_METAZENS_WALLET_API ?? '';

export const walletClient = createJRPCClient(REACT_APP_METAZENS_WALLET_API, 'wallet');

export const getAddresses = async (chainId?: string): Promise<JrpcWalletAddress[]> => {
  chainId ||= networkVersion.getChainId();
  const results = await walletClient.request('mtz_wallet_getOrCreateAddresses', [chainId]);

  return results;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signTx = async (address: string, rawTx: any, _client?: JSONRPCClient<any>): Promise<any> => {
  try {
    const client = _client ?? walletClient;
    const result: unknown = await client.request('mtz_wallet_signTx', [address, rawTx]);
    // direct response from jrpc-wallet will returns string
    if (typeof result === 'string' && result.startsWith('0x')) return <string>result;
    // pending tx response from policy engine will returns an object with traceId, and traceMethod
    if ((<SignTxPendingResponse>result).traceId && (<SignTxPendingResponse>result).traceMethod) {
      const { traceId, traceMethod } = <SignTxPendingResponse>result;
      const firstRes = await client.request(traceMethod, { traceId });
      // the following request may take long time to resolve,
      // should consider another UX to handle
      const peRes = await loopFetching(client, traceMethod, traceId, firstRes);
      const { status, tx, rejectReason } = peRes;
      if (status === SignTxStatus.APPROVED) {
        if (!tx) {
          throw new Error('Something went wrong when sign transaction, please retry again later.');
        }
        return tx;
      }
      // handle rejected
      if (status === SignTxStatus.REJECTED) {
        throw new Error(rejectReason);
      }
      throw new Error(`Unhandled async return state from signTx: ${JSON.stringify(peRes)}`); // ....
    }
    throw new Error(`Unknown error signTx: ${result}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const signMessage = async (chainId: string, address: string, message: string) => {
  const result = await walletClient.request('mtz_wallet_signMessage', [chainId, address, message]);
  return result;
};

export const signTypedData = async (chainId: string, address: string, data: EIP712TypedData) => {
  const result = await walletClient.request('mtz_wallet_signTypedData', [chainId, address, data]);
  return result;
};

export const ecRecovery = async (chainId: string, address: string, hexMessage: string, hexSign: string) => {
  const result = await walletClient.request('mtz_wallet_ecRecovery', [chainId, address, hexMessage, hexSign]);
  return result;
};
