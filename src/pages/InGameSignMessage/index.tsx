import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStateData } from '@hooks/useLocationStateData';

import Container from '@mui/material/Container';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';
import InGameSigningPageFooter from '@components/InGameSigning/InGameSigningPageFooter';
import InGameSigningPageHeader from '@components/InGameSigning/InGameSigningPageHeader';
import InGameSigningPageContent from '@components/InGameSigning/InGameSigningPageContent';

import { signMessage } from '@services/APIServices/wallet';
import {
  bridgeDataEmitter,
  bridgeEmitCloseWallet,
  bridgeEmitError,
} from '@services/web3/web3-api-service/messageEventHandler/bridgeDataEmitter';
import { BridgeEventData } from '@services/web3/web3-api-service/messageEventHandler/types';

import { validations } from './validations';
import { InGameSigningType } from '@gryfyn-types/props/InGameSigningProps';

export const InGameSignMessagePage: FC = () => {
  const navigate = useNavigate();
  const state = useLocationStateData() as BridgeEventData;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const { id, method, params = [] } = state;
  const [chainId, address, message] = params as string[];

  const onCancelClick = (): void => {
    bridgeEmitError(4001, id, 'User Cancel');
    navigate('/page/in-game-finish');
    bridgeEmitCloseWallet();
  };

  const onSignClick = (): void => {
    setIsLoading(true);
    (async () => {
      const errors = validations(chainId, address, message);
      if (errors.length > 0) {
        setErrorMessage(errors);
        setIsLoading(false);
        return;
      }
      const result = await signMessage(chainId, address, message);
      bridgeDataEmitter({ id, method, response: result });
      setIsLoading(false);
      navigate('/page/in-game-finish');
      bridgeEmitCloseWallet();
    })();
  };

  return (
    <main>
      <DefaultErrorBoundary>
        <Container maxWidth="sm" sx={{ px: 4, pt: '16px', pb: '16px', height: '100%' }}>
          <InGameSigningPageHeader />
          <InGameSigningPageContent type={InGameSigningType.MESSAGE} message={message} />
          <InGameSigningPageFooter
            isLoading={isLoading}
            onSign={onSignClick}
            onCancel={onCancelClick}
            errorMessage={errorMessage}
          />
        </Container>
      </DefaultErrorBoundary>
    </main>
  );
};
