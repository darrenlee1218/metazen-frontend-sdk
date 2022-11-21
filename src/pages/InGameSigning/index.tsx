import React, { FC, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

import DefaultErrorBoundary from '@components/DefaultErrorBoundary';
import InGameSigningPageHeader from '@components/InGameSigning/InGameSigningPageHeader';
import InGameSigningPageFooter from '@components/InGameSigning/InGameSigningPageFooter';
import InGameSigningPageContent from '@components/InGameSigning/InGameSigningPageContent';

import { useLocationStateData } from '@hooks/useLocationStateData';
import { SignTxSuccessCallback, useMfaFlow } from '@hooks/useMfaFlow';

import { getGasPrice, LegacyBuiltTx } from '@services/APIServices/tx-builder';
import { BridgeEventData } from '@services/web3/web3-api-service/messageEventHandler/types';
import {
  bridgeDataEmitter,
  bridgeEmitCloseWallet,
  bridgeEmitError,
} from '@services/web3/web3-api-service/messageEventHandler/bridgeDataEmitter';

import { useSnackbar } from '@lib/snackbar';
import { CachedJsonRpcProviders } from '@lib/ethers/cached-providers';

import { useGetTokensQuery } from '@redux/api/assetMaster';
import { InGameSigningType } from '@gryfyn-types/props/InGameSigningProps';
import nodeProvider from '@services/provider/node';
import { keccak256 } from 'ethers/lib/utils';

export const InGameSigningPage: FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const state = useLocationStateData() as BridgeEventData;

  const { data: tokens = [], isLoading: fetchingTokens } = useGetTokensQuery();
  const supportedNetworks: { [chainId: string]: string } = {};
  tokens.forEach((token) => {
    if (typeof supportedNetworks[token.chain.chainID] === 'undefined') {
      supportedNetworks[token.chain.chainID] = token.chain.chainName;
    }
  });

  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const { id, method, params = [] } = state;
  const [chainId, address, tx] = params as [chainId: string, address: string, tx: LegacyBuiltTx];

  const handleSignTxSuccess = useCallback<SignTxSuccessCallback>(
    async (signedTx: string) => {
      // pre-generate txHash for return use, no matter the chain accept it or not
      const txHash = keccak256(signedTx);
      try {
        // this try catch ensure respond is emitted back to provider side
        const provider = CachedJsonRpcProviders.getInstance(nodeProvider[chainId]);
        await provider.sendTransaction(signedTx);
        bridgeDataEmitter({ id, method, response: txHash });
      } catch (err) {
        // if boardcast failed, just log the error
        console.error('boardcast error:', err);
        bridgeEmitError(4900, id, 'Unable to dispatch transaction');
      } finally {
        bridgeEmitCloseWallet();
        navigate('/page/in-game-finish');
      }
    },
    [id, method, navigate],
  );
  const { signTx, signTxLoading, signTxError } = useMfaFlow({ signTx: handleSignTxSuccess });

  useEffect(() => {
    if (signTxError) {
      enqueueSnackbar(signTxError, { variant: 'error' });
    }
  }, [signTxError]);

  const onCancelClick = (): void => {
    bridgeEmitError(4001, id, 'User Cancel');
    navigate('/page/in-game-finish');
    bridgeEmitCloseWallet();
  };

  const onSignClick = (): void => {
    (async () => {
      if (typeof supportedNetworks[chainId] === 'undefined') {
        setErrorMessage(['Unsupported chain for the signing request.']);
      }
      const provider = CachedJsonRpcProviders.getInstance(nodeProvider[chainId]);
      if (!tx.nonce) {
        const nonce = await provider.getTransactionCount(address);
        tx.nonce = nonce;
      }
      // as a contract call, 4 bytes function signature plus `0x` already 10 char long
      const estimateGasLimit = await provider.estimateGas(tx as any).catch(() => {
        // fallback to a big enough fix gasLimit value
        return BigNumber.from(100000);
      });
      // as tx-builder, 20% of buffer
      tx.gasLimit = estimateGasLimit.mul(6).div(5).toHexString();

      // REMARK: most recent gas price estimation before sign
      const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice(tx.chainId);
      tx.maxFeePerGas = maxFeePerGas as string;
      tx.maxPriorityFeePerGas = maxPriorityFeePerGas as string;

      try {
        signTx(address, tx);
      } catch (err: unknown) {
        console.error(err);
        setErrorMessage(['Unexpected error when signing transaction.']);
      }
    })();
  };

  return (
    <main>
      <DefaultErrorBoundary>
        {fetchingTokens ? (
          <Box
            sx={{
              p: 0,
              flex: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress disableShrink />
          </Box>
        ) : (
          <Container maxWidth="sm" sx={{ px: 4, pt: '16px', pb: '16px', height: '100%' }}>
            <InGameSigningPageHeader />
            <InGameSigningPageContent type={InGameSigningType.TRANSACTION} txDetails={tx} />
            <InGameSigningPageFooter
              isLoading={signTxLoading}
              onSign={onSignClick}
              onCancel={onCancelClick}
              errorMessage={errorMessage}
            />
          </Container>
        )}
      </DefaultErrorBoundary>
    </main>
  );
};
