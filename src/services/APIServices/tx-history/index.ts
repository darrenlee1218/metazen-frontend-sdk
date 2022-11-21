import { createJRPCClient } from '@lib/JRPCClient';
import { GetTopNTransactionsResponse } from './GetTopNEventResponse';

const REACT_APP_METAZENS_TXHISTORY_API = process.env.REACT_APP_METAZENS_TXHISTORY_API ?? '';

export const txhistoryClient = createJRPCClient(REACT_APP_METAZENS_TXHISTORY_API, 'tx-history');

// TODO Mocked APIs.
export const getEventsByTxHash = () =>
  txhistoryClient.request('mtz_tx_history_GetEventsByTxHash', {
    txHash: '0x629b6b5486524290c01dbbe393193354e0c723aab0dce1fa663f9ea22986de2f',
  });

export const getTopNTransactions = async (
  eventsNumber: number,
  chainId?: string,
  sortId?: string,
  assetKey?: string,
): Promise<GetTopNTransactionsResponse[]> => {
  const results = await txhistoryClient.request('mtz_tx_history_GetTopNTransactions', {
    eventsNumber,
    chainId,
    sortId,
    assetKey,
  });

  return results;
};

export const getEventDetailsByTxHash = () =>
  txhistoryClient.request('mtz_tx_history_GetEventDetailsByTxHash', {
    txHash: '0x629b6b5486524290c01dbbe393193354e0c723aab0dce1fa663f9ea22986de2f',
  });
