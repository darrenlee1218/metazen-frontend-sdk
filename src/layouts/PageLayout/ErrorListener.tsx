import { FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSnackbar } from '@lib/snackbar';
import { apiClientInstances } from '@lib/api/axios-event-client';
import * as Web3MethodMap from '@services/web3/web3-api-service/messageEventHandler/methodMap';

export const ErrorListener: FC = () => {
  const navigate = useNavigate();
  // optimize with useRef as navigate changes after each navigation
  const navigateRef = useRef<ReturnType<typeof useNavigate>>(navigate);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const renderMessage = (message: string) => {
      enqueueSnackbar(message, { variant: 'error' });
    };

    const handleAuthError = async () => {
      await Web3MethodMap.handleLogout();
      navigateRef.current('/page/session-expired');
    };

    console.debug(`Registering ${apiClientInstances.length} API Client Instances`);
    apiClientInstances.forEach((client) => {
      client.on('api:error', renderMessage);
      client.on('api:unauthorized', handleAuthError);
    });

    return () => {
      apiClientInstances.forEach((client) => {
        client.off('api:error', renderMessage);
        client.off('api:unauthorized', handleAuthError);
      });
    };
  }, [enqueueSnackbar]);

  return null;
};
