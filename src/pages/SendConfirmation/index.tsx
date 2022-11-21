import React, { useState, useCallback, useEffect } from 'react';
import { getTime } from 'date-fns';
import BigNumber from 'bignumber.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { CustomTheme, useTheme } from '@mui/material/styles';

import { NetworkBar } from '@components/NetworkBar';
import BackNavigation from '@components/BackNavigation';
import { WalletAddressBar } from '@components/WalletAddressBar';
import { TokenValueDisplay } from '@components/TokenValueDisplay';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';

import nodeProvider from '@services/provider/node';
import { BuiltTx } from '@services/APIServices/tx-builder';

import { useNativeCurrency } from '@hooks/useNativeCurrency';
import { useLocationStateData } from '@hooks/useLocationStateData';
import { SignTxSuccessCallback, useMfaFlow } from '@hooks/useMfaFlow';

import { useSnackbar } from '@lib/snackbar';
import { CachedJsonRpcProviders } from '@lib/ethers/cached-providers';

import { addPendingTx } from '@redux/reducer/pendingTransactions';
import { SendConfirmationDetails } from '@gryfyn-types/props/SendTokenProps';

export const SendConfirmationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme() as CustomTheme;
  const { enqueueSnackbar } = useSnackbar();
  const confirmationDetails = useLocationStateData<SendConfirmationDetails>();

  const [sendTxErrorMessage, setSendTxErrorMessage] = useState<string>('');

  const sendToken = confirmationDetails?.sendToken;
  const nativeCurrency = useNativeCurrency(sendToken?.chainId ?? '');

  const handleSignTxSuccess = useCallback<SignTxSuccessCallback>(
    async (signedTx, { rawTx }) => {
      if (typeof confirmationDetails !== 'undefined') {
        try {
          const {
            gasPayer,
            sendToken: token,
            token: { txUrl },
          } = confirmationDetails;
          const providerURI = nodeProvider[token.chainId];
          const provider = CachedJsonRpcProviders.getInstance(providerURI);
          const { hash } = await provider.sendTransaction(signedTx);
          // Add pending transaction record into persist redux store
          // We are using ! here as we assume all parameters exist if the transaction can be broadcasted
          dispatch(
            addPendingTx({
              hash,
              txUrl,
              token,
              gasPayer,
              tx: rawTx as BuiltTx,
              createdAt: getTime(new Date()).toString(),
            }),
          );
          setSendTxErrorMessage('');
          navigate('/recent-activity');
        } catch (rawError: any) {
          const jrpcError = rawError?.error?.error;
          console.log('JRPC ERROR');
          console.log(JSON.stringify(rawError));
          const finalErrorMessage = typeof jrpcError !== 'undefined' ? jrpcError.message : '';
          setSendTxErrorMessage(`${finalErrorMessage.charAt(0).toUpperCase()}${finalErrorMessage.slice(1)}`);
        }
      }
    },
    [dispatch, navigate, confirmationDetails],
  );

  const { signTx, signTxLoading, signTxError } = useMfaFlow({ signTx: handleSignTxSuccess });

  useEffect(() => {
    if (signTxError) {
      enqueueSnackbar(signTxError, { variant: 'error' });
    }
  }, [signTxError]);

  const onConfirm = async (): Promise<void> => {
    if (typeof confirmationDetails !== 'undefined') {
      const {
        builtTx,
        sendToken: { fromAddress },
      } = confirmationDetails;
      // cleanup error before sign tx
      setSendTxErrorMessage('');
      signTx(fromAddress, builtTx);
    }
  };

  useEffect(() => {
    if (sendTxErrorMessage) {
      enqueueSnackbar(sendTxErrorMessage, { variant: 'error' });
    }
  }, [sendTxErrorMessage]);

  if (!nativeCurrency || !confirmationDetails) {
    return null;
  }

  const {
    token,
    tokenBalance,
    userInput: { to, amount },
    builtTx: { gasLimit, maxFeePerGas },
    sendToken: { symbol, chainName, networkIcon },
  } = confirmationDetails;

  console.log(`in SendConfirmationPage maxFeePerGas:${maxFeePerGas}, gasLimit:${gasLimit}`);

  return (
    <DefaultErrorBoundary>
      <BackNavigation
        label={`Confirm Send`}
        onBackPress={() => {
          setSendTxErrorMessage('');
          navigate('/page/wallet/send', {
            replace: true,
            state: {
              data: {
                token,
                tokenBalance,
              },
            },
          });
        }}
      />
      <Container sx={{ mb: 2, height: '100%', flex: 1 }}>
        <Typography
          sx={{
            mb: 1,
            color: 'white',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: '600',
          }}
          data-testId="amount-and-symbol"
        >
          {`${amount} ${symbol}`}
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }} color="text.secondary">
          {`Send only ${symbol} on `}
          <Typography variant="h5" sx={{ display: 'contents', fontWeight: 'bold' }}>
            {chainName}
          </Typography>
          {' network to this recipient address. Sending any other coins may result in permanent loss.'}
        </Typography>
        <Stack sx={{ mt: 3 }} spacing={1.5}>
          <NetworkBar networkIconUrl={networkIcon} chainName={chainName} />
          <WalletAddressBar walletAddress={to} />
          <Box
            sx={{
              backgroundColor: 'colors.nonClickableGray',
              padding: '12px',
              borderRadius: '3px',
            }}
          >
            <Typography
              variant="h4"
              color="text.secondary"
              sx={{
                marginTop: '8px',
              }}
            >
              Network Fee
            </Typography>
            <TokenValueDisplay.Amount
              variant="h2"
              fontWeight={600}
              precision="custody"
              color="text.primary"
              token={nativeCurrency}
              amount={new BigNumber(maxFeePerGas).multipliedBy(gasLimit).toString()}
            />
          </Box>
          {sendTxErrorMessage.length > 0 && (
            <Typography variant="h4" color={theme.palette.colors.errorPrimary} sx={{ mb: 2, mt: 4 }}>
              {sendTxErrorMessage}
            </Typography>
          )}
        </Stack>
      </Container>
      <div style={{ marginRight: '24px', marginLeft: '24px' }}>
        <LoadingButton
          fullWidth
          type="submit"
          color="primary"
          disableElevation
          loading={signTxLoading}
          variant="contained"
          onClick={onConfirm}
          sx={{
            mt: sendTxErrorMessage.length > 0 ? 0 : 4,
            fontWeight: '600',
            textTransform: 'none',
            fontSize: '16px',
            mb: 4,
          }}
        >
          Confirm
        </LoadingButton>
      </div>
    </DefaultErrorBoundary>
  );
};
