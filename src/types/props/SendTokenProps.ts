import { BuiltTx } from '@services/APIServices/tx-builder';
import Token from '@gryfyn-types/data-transfer-objects/Token';
import SendToken from '@gryfyn-types/data-transfer-objects/SendToken';
import TokenBalance from '@gryfyn-types/data-transfer-objects/TokenBalance';

export interface SendFormInput {
  toAddress: string;
  amount: string;
  errors?: Record<string, string>;
}

export interface SendPageTokenDetails {
  token: Token;
  tokenBalance: TokenBalance;
}

export interface SendConfirmationDetails {
  token: Token;
  builtTx: BuiltTx;
  gasPayer: SendToken;
  sendToken: SendToken;
  tokenBalance: TokenBalance;
  userInput: {
    to: string;
    amount: string;
  };
}

export interface SendFormProps {
  sendToken: SendToken;
  gasPrice: string;
  gasPayer?: SendToken;
  isProcessing: boolean;
  tokenBalance?: TokenBalance;
  buildTxErrorMessage: string;
  onSubmitForm: (v: SendFormInput) => Promise<void>;
}

// Example error response
// {
//   error: Error: processing response error (body="...", error={"code":-32000}, ...)
//     at Logger.makeError (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/logger/src.ts/index.ts:261:28)
//     at Logger.throwError (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/logger/src.ts/index.ts:273:20)
//     at /home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/web/src.ts/index.ts:329:28
//     at step (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/web/lib/index.js:33:23)
//     at Object.next (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/web/lib/index.js:14:53)
//     at fulfilled (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/web/lib/index.js:5:58)
//     at processTicksAndRejections (node:internal/process/task_queues:95:5) {
//       reason: 'processing response error',
//       code: 'SERVER_ERROR',
//       body: '...',
//       error: Error: invalid sender
//         at getResult (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/providers/src.ts/json-rpc-provider.ts:142:28)
//         at processJsonFunc (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/web/src.ts/index.ts:371:22)
//         at /home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/web/src.ts/index.ts:308:42
//         at step (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/web/lib/index.js:33:23)
//         at Object.next (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/web/lib/index.js:14:53)
//         at fulfilled (/home/chrisliu/git/hex-test/local-testing/node_modules/@ethersproject/web/lib/index.js:5:58)
//         at processTicksAndRejections (node:internal/process/task_queues:95:5) {
//           code: -32000,
//           data: undefined
//         }
//     }
// }

export interface EthersSendTxError {
  message: string;
  reason: string;
  code: string;
  body: string;
  error: {
    message: string;
    code: number;
  };
}
