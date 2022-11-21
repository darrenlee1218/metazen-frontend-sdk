import { LegacyBuiltTx } from '@services/APIServices/tx-builder';
import { EIP712TypedData } from '@gryfyn-types/data-transfer-objects/EIP712TypedData';

export enum InGameSigningType {
  TRANSACTION = 1,
  MESSAGE = 2,
  TYPED_DATA = 3,
}

// TODO: will use this once we figure out the deserialization integration with provider
export interface InGameTransaction {
  from: string;
  to: string;
  data: string;
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

export interface InGameTransactionContent {
  to: string;
  value: string;
  networkName: string;
}

export interface InGameSigningPageContentProps {
  type: InGameSigningType;
  // Only exist when type = 1
  txDetails?: LegacyBuiltTx;
  // Only exist when type = 2
  message?: string;
  // Only exist when type = 3
  typedData?: EIP712TypedData;
}

export interface InGameSigningPageFooterProps {
  isLoading: boolean;
  errorMessage: string[];
  onCancel: () => void;
  onSign: () => void;
}
