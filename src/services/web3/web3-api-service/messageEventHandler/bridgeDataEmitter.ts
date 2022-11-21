import { BridgeEventResponse, JSONRPCErrorResponse } from './types';

const messageHeader = '{gryfyn_message}';

export enum ActiveEmit {
  CONNECTED = 'gryfyn_connected',
  DISCONNECTED = 'gryfyn_disconnected',
  CHAIN_CHANGED = 'gryfyn_chainChanged',
  CLOSE_WALLET = 'gryfyn_close_wallet',
}

/**
 * extract this simple call out for futher develop. (either using rxjs or not)
 * @param param0
 */
export const bridgeDataEmitter = <T>({ id, method, response }: BridgeEventResponse<T>): void => {
  const target = window.emitTarget.getTarget();
  target.postMessage(messageHeader + JSON.stringify({ id, method, response }), '*');
};

export const bridgeErrorDataEmitter = ({ id, error }: JSONRPCErrorResponse): void => {
  const target = window.emitTarget.getTarget();
  target.postMessage(messageHeader + JSON.stringify({ id, response: { error } }), '*');
};

export const bridgeEmitCloseWallet = (): void => {
  bridgeDataEmitter({
    id: -1,
    method: ActiveEmit.CLOSE_WALLET,
    response: '',
  });
};

export const bridgeEmitError = (code: number, id: number, error: string) => {
  console.log('error:', code, id, error);
  bridgeErrorDataEmitter({
    id,
    error: {
      message: error,
      code,
    },
  });
};
