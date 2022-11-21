import BigNumber from 'bignumber.js';
import getTime from 'date-fns/getTime';
import { useDispatch } from 'react-redux';
import React, { FC, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { CloseIcon } from '@assets/icons/CloseIcon';
import DialogContent from '@mui/material/DialogContent';
import { SpeedUpIcon } from '@assets/icons/SpeedUpIcon';
import { useTheme, CustomTheme } from '@mui/material/styles';
import { CloseFilledIcon } from '@assets/icons/CloseFilledIcon';
import { formatAmount } from '@components/TokenValueDisplay/format-amount';

import { GasFee, BuiltTx, getGasPrice, UserActionOnTx, checkEnoughBalance } from '@services/APIServices/tx-builder';
import { useSnackbar } from '@lib/snackbar';
import nodeProvider from '@services/provider/node';
import { useNativeCurrency } from '@hooks/useNativeCurrency';
import { addPendingTx } from '@redux/reducer/pendingTransactions';
import { SignTxSuccessCallback, useMfaFlow } from '@hooks/useMfaFlow';
import { CachedJsonRpcProviders } from '@lib/ethers/cached-providers';
import { EthersSendTxError } from '@gryfyn-types/props/SendTokenProps';
import { useGetAssetMetadataQuery } from '@redux/api/assetMetadataCache';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import { PendingTxOperationModalProps, TPendingTxOperation } from '@gryfyn-types/props/PendingTransactionProps';

export const PendingTxOperationModal: FC<PendingTxOperationModalProps> = ({
  hash,
  tx,
  open,
  nftId,
  type,
  width,
  token,
  height,
  setOpen,
  gasPayer,
}) => {
  const { data: nftMetadata } = useGetAssetMetadataQuery(
    {
      chainId: tx?.chainId,
      contractAddress: token?.contractAddress,
      tokenId: nftId,
    },
    { skip: ![TokenStandard.ERC721, TokenStandard.ERC1155].includes(token.standard) },
  );
  const theme = useTheme() as CustomTheme;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [gasPrice, setGasPrice] = useState<GasFee>({
    maxFeePerGas: '0x0',
    maxPriorityFeePerGas: '0x0',
  });
  const [speedUpTxErrorMessage, setSpeedUpTxErrorMessage] = useState<string>('');
  const nativeCurrency = useNativeCurrency(tx.chainId);

  const enoughBalance = useMemo(
    () => checkEnoughBalance('', undefined, gasPrice.maxFeePerGas, gasPayer).fee,
    [gasPrice, gasPayer],
  );

  useEffect(() => {
    const fetchedGasPrice = async () => {
      const gasFee = await getGasPrice(
        tx.chainId,
        {
          maxFeePerGas: tx.maxFeePerGas,
          maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        },
        UserActionOnTx.SpeedUp,
      );

      console.log(`gasFee: ${JSON.stringify(gasFee)}`);

      setGasPrice(gasFee);
    };
    void fetchedGasPrice();
    // const intervalId = setInterval(fetchedGasPrice, 10000);

    // return () => clearInterval(intervalId);
  }, []);

  const broadcast = async (signed: string): Promise<string> => {
    try {
      const providerURI = nodeProvider[token.chainId];
      const provider = CachedJsonRpcProviders.getInstance(providerURI);
      const result1 = await provider.sendTransaction(signed);
      return result1.hash;
    } catch (rawError) {
      const {
        error: { message },
      } = rawError as EthersSendTxError;
      setSpeedUpTxErrorMessage(message);
      return '';
    }
  };

  const handleSignTxSuccess = useCallback<SignTxSuccessCallback>(
    async (signedTx, { rawTx }) => {
      // Broadcast transaction
      const newHash = await broadcast(signedTx);
      setSpeedUpTxErrorMessage('');

      if (newHash !== '') {
        dispatch(
          addPendingTx({
            hash: newHash,
            token,
            gasPayer,
            tx: rawTx as BuiltTx,
            createdAt: getTime(new Date()).toString(),
            speedUpFrom: type === TPendingTxOperation.Speedup ? hash : '',
            cancelledFrom: type === TPendingTxOperation.Cancel ? hash : '',
          }),
        );
      }
      setOpen(false);
    },
    [broadcast, gasPayer, hash, setOpen, token, type],
  );
  const { signTx, signTxLoading, signTxError } = useMfaFlow({ signTx: handleSignTxSuccess });

  useEffect(() => {
    if (signTxError) {
      enqueueSnackbar(signTxError, { variant: 'error' });
    }
  }, [signTxError]);

  const prepareBroadcast = async (): Promise<void> => {
    const gasFee = await getGasPrice(
      tx.chainId,
      {
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      },
      UserActionOnTx.SpeedUp,
    );

    console.log(`gasFee: ${JSON.stringify(gasFee)}`);

    const newTx =
      type === TPendingTxOperation.Speedup
        ? { ...tx, ...gasFee }
        : { ...tx, ...gasFee, to: token.fromAddress, data: '0x', value: '0x0' };

    try {
      signTx(token.fromAddress, newTx);

      // Testing code for mocking empty signedTx response after waiting few seconds
      // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      // await delay(2000); /// waiting 2 second
      // const signedTx = '';
    } catch (err) {
      setSpeedUpTxErrorMessage('Unexpected error when signing transaction.');
    }
  };

  const assetImageString = (standard: string) => {
    switch (true) {
      case standard === TokenStandard.ERC721:
      case standard === TokenStandard.ERC1155:
        return String(nftMetadata?.data.image);
      default:
        return String(token.icon);
    }
  };

  if (!nativeCurrency) {
    return null;
  }

  console.log(`gasLimit: ${tx.gasLimit}`);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        p: 0,
        top: '50%',
        left: '50%',
        boxShadow: 24,
        position: 'absolute',
        width: width ?? 320,
        height: height ?? 440,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <DialogContent
        sx={{
          px: 2,
          py: 0,
          borderRadius: 3,
          bgcolor: theme.palette.colors.nonClickableGray,
          border: `1px solid ${theme.palette.colors.border}`,
        }}
      >
        <Box
          sx={{
            height: '48px',
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton
              disableRipple
              disableFocusRipple
              onClick={() => setOpen(false)}
              sx={{ p: 0, width: '24px', height: '24px' }}
            >
              <CloseFilledIcon width="24px" height="24px" />
            </IconButton>
          </Box>
          <Typography
            variant="h2"
            align="center"
            color="text.primary"
            sx={{ width: '100%', fontSize: 16, fontWeight: 600 }}
          >
            {type === TPendingTxOperation.Speedup && 'Speed Up Transaction'}
            {type === TPendingTxOperation.Cancel && 'Cancel Transaction'}
          </Typography>
        </Box>
        <Box
          sx={{
            pb: 4,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 48px)',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Avatar
                  sx={{
                    width: '16px',
                    height: '16px',
                    border: `1px solid ${theme.palette.colors.border}`,
                    backgroundColor: theme.palette.colors.nonClickableGray,
                  }}
                >
                  {type === TPendingTxOperation.Cancel && <CloseIcon />}
                  {type === TPendingTxOperation.Speedup && <SpeedUpIcon />}
                </Avatar>
              }
            >
              <Avatar alt={token.tokenName} src={assetImageString(token.standard)} />
            </Badge>
            <Typography align="center" variant="h4" color={theme.palette.colors.secondaryText} sx={{ mt: 2 }}>
              {type === TPendingTxOperation.Speedup &&
                'Confirming this does not guarantee your transaction will be accelerated. But if it is successful, then you will be charged the new network fee below.'}
              {type === TPendingTxOperation.Cancel &&
                'Confirming this does not guarantee your transaction will be cancelled. But if it is successful, this will replace the original network fee.'}
            </Typography>
          </Box>
          <Box>
            {!enoughBalance && (
              <Typography variant="h5" color={theme.palette.colors.errorPrimary}>
                Not enough balance to pay for the network fee.
              </Typography>
            )}
            {speedUpTxErrorMessage.length > 0 && (
              <Typography variant="h5" color={theme.palette.colors.errorPrimary}>
                {speedUpTxErrorMessage}
              </Typography>
            )}
            <Box
              sx={{
                mt: '12px',
                display: 'flex',
                padding: '12px',
                borderRadius: '3px',
                color: 'text.secondary',
                justifyContent: 'space-between',
                border: `1px solid ${theme.palette.colors.border}`,
                backgroundColor: theme.palette.colors.nonClickableGray,
              }}
            >
              <Typography variant="h4">Network Fee</Typography>
              <Typography variant="h4">
                {gasPrice.maxFeePerGas === '0x0'
                  ? 'Loading...'
                  : formatAmount({
                      token: nativeCurrency,
                      amount: new BigNumber(gasPrice.maxFeePerGas).multipliedBy(tx.gasLimit).toString(),
                      precision: 'custody',
                    })}
              </Typography>
            </Box>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {type === TPendingTxOperation.Speedup && (
                <>
                  <Button
                    fullWidth
                    disableElevation
                    color="secondary"
                    variant="contained"
                    onClick={() => setOpen(false)}
                    sx={{
                      mr: 1,
                      fontWeight: 600,
                      textTransform: 'none',
                      color: theme.palette.colors.primaryText,
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    fullWidth
                    type="submit"
                    color="primary"
                    disableElevation
                    variant="contained"
                    onClick={prepareBroadcast}
                    loading={signTxLoading}
                    disabled={!enoughBalance}
                    sx={{ fontWeight: 600, textTransform: 'none' }}
                  >
                    Confirm
                  </LoadingButton>
                </>
              )}
              {type === TPendingTxOperation.Cancel && (
                <LoadingButton
                  fullWidth
                  type="submit"
                  color="error"
                  disableElevation
                  variant="contained"
                  onClick={prepareBroadcast}
                  loading={signTxLoading}
                  disabled={!enoughBalance}
                  sx={{ fontWeight: 600, textTransform: 'none' }}
                >
                  Confirm
                </LoadingButton>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
