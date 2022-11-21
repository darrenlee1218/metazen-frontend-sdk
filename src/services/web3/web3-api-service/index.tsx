/* eslint-disable complexity */
import React from 'react';
import { WalletConfig } from '@gryfyn-types/props/WalletProps';
import { useMessageEventHandler } from './messageEventHandler';
// import { useBridgeEvent } from './bridgeEventReceiverHook';

const messageHeader = '{gryfyn_message}';

export const sendToApi = (method: string, id: number, response: unknown) => {
  const myResponse = {
    method,
    response,
    id,
  };

  window.parent.postMessage(messageHeader + JSON.stringify(myResponse), '*');
  return [];
};

export const sendErrorToApi = (code: number, id: number, error: unknown) => {
  const myResponse = {
    method: 'error',
    params: {
      code,
      message: error,
    },
    id,
  };

  window.parent.postMessage(messageHeader + JSON.stringify(myResponse), '*');
  return [];
};

interface Web3ListenerProps {
  // ref: React.MutableRefObject<any>;
  openWallet: (config: WalletConfig) => void;
}

export interface Web3ListenerRef {
  closeWallet: () => void;
}

export const Web3ListenerTest: React.FC<Web3ListenerProps> = ({ openWallet }) => {
  useMessageEventHandler(openWallet);
  return null;
};
