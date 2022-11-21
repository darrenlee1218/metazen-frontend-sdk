import { createJRPCClient } from '@lib/JRPCClient';
import BalanceData from '@gryfyn-types/data-transfer-objects/BalanceData';

const REACT_APP_METAZENS_BOOKKEEPING_API = process.env.REACT_APP_METAZENS_BOOKKEEPING_API ?? '';

export const bookkeepingClient = createJRPCClient(REACT_APP_METAZENS_BOOKKEEPING_API, 'book-keeping');

export const getBalances = async (): Promise<BalanceData[]> => bookkeepingClient.request('mtz_bk_GetBalancesRequest');

export const getBalanceByChainIdRequest = () =>
  bookkeepingClient.request('mtz_bk_GetBalanceByChainIdRequest', {
    chainId: '80001',
  });
