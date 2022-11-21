import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useContext } from 'react';
import { WalletConfigContext } from '@contexts/walletConfig';

import { execMethod, getMethodMap } from './methodMap';
import { IBridgeEvent, OpenWalletCall } from './types';
import { createCheckOrigin, checkTrusted, messageEventDataParser } from './utils';

export const defaultOption: IBridgeEvent = {
  allowedOrigin: ['*'],
};

export const useMessageEventHandler = (openWalletCall: OpenWalletCall, options = defaultOption) => {
  const { setConfig } = useContext(WalletConfigContext);
  const navigate = useNavigate();
  const checkOrigin = createCheckOrigin(options.allowedOrigin);
  const handleResponse = useCallback(
    async (event: MessageEvent) => {
      try {
        checkTrusted(event);
        checkOrigin(event.origin);
        const payload = messageEventDataParser(event);
        // ignore events that is not related to this handler
        if (payload.method === 'none') return;
        // handling events
        const methodMap = getMethodMap(openWalletCall, navigate, setConfig);
        execMethod(methodMap, payload);
      } catch (err) {
        console.log('error in use bridge event:', err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openWalletCall],
  );
  useEffect(() => {
    // better to consume window object in a different way
    window.addEventListener('message', handleResponse);
    return function unsubscribe() {
      window.removeEventListener('message', handleResponse);
    };
  });
};
