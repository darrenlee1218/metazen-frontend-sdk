import { Dispatch, SetStateAction } from 'react';
import { BuiltTx } from '@services/APIServices/tx-builder';
import SendToken from '@gryfyn-types/data-transfer-objects/SendToken';

export enum TPendingTxOperation {
  Speedup = 'SPEEDUP',
  Cancel = 'CANCEL',
}

export interface PendingTransactionRecord {
  hash: string;
  tx: BuiltTx;
  token: SendToken;
  createdAt: string;
  gasPayer: SendToken;
  speedUpFrom?: string;
  cancelledFrom?: string;
  nftId?: string;
  txUrl?: string;
}

export interface PendingTxOperationModalProps {
  hash: string;
  tx: BuiltTx;
  open: boolean;
  nftId?: string;
  token: SendToken;
  gasPayer: SendToken;
  type: TPendingTxOperation | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
  width?: number;
  height?: number;
}
