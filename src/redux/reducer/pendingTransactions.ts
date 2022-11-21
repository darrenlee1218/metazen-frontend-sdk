import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PendingTransactionRecord } from '@gryfyn-types/props/PendingTransactionProps';

const initialState: PendingTransactionRecord[] = [];

export const pendingTransactionsSlice = createSlice({
  name: 'pendingTransactions',
  initialState,
  reducers: {
    addPendingTx(state, action: PayloadAction<PendingTransactionRecord>) {
      state.push(action.payload);
    },
    deletePendingTx(state, action: PayloadAction<string>) {
      function mutationFilter(arr: PendingTransactionRecord[], cb: (item: PendingTransactionRecord) => boolean) {
        for (let l = arr.length - 1; l >= 0; l -= 1) {
          if (!cb(arr[l])) arr.splice(l, 1);
        }
      }
      const concatBothCancelAndSpeedupFrom = state
        .map((item) => item.speedUpFrom)
        .concat(state.map((item) => item.cancelledFrom));
      const cond = (item: PendingTransactionRecord) => !concatBothCancelAndSpeedupFrom.includes(item.hash);
      mutationFilter(state, cond);
      state.splice(
        state.findIndex((item) => item.hash === action.payload),
        1,
      );
    },
  },
});

export const { addPendingTx, deletePendingTx } = pendingTransactionsSlice.actions;
