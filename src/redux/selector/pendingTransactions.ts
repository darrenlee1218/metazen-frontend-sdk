import { PendingTransactionRecord } from '@gryfyn-types/props/PendingTransactionProps';

export const selectPendingTransactions = (state: { pendingTransactions: PendingTransactionRecord[] }) =>
  state.pendingTransactions;
