import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useSnackbar } from '@lib/snackbar';
import { SendGameItemStep, useSendGameItem } from '@hooks/useSendGameItem';

import { SendGameItemForm } from './SendGameItemForm';
import { SendGameItemConfirm } from './SendGameItemConfirm';

export const SendGameItem: FC = () => {
  const { key = '', tokenId = '' } = useParams<{ key: string; tokenId: string }>();
  const {
    nativeCurrency,
    nativeCurrencyBalance,

    nftToken,
    nftMetadata,

    builtTx,
    buildTx,

    transactionFee,

    handleConfirm,
    updateBuiltTx,

    control,
    recipientAddress,
    updateRecipientAddress,

    step,
    toNextStep,
    toPrevStep,

    isLoading,
    sendError,
    signTxError,
  } = useSendGameItem(key, tokenId);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (sendError) {
      enqueueSnackbar(sendError, { variant: 'error' });
    }
    if (signTxError) {
      enqueueSnackbar(signTxError, { variant: 'error' });
    }
  }, [sendError, signTxError]);

  if (!nativeCurrency || !nftToken || !nftMetadata) {
    return null;
  }

  return (
    <>
      {step === SendGameItemStep.FillForm && (
        <SendGameItemForm
          control={control}
          nativeCurrency={nativeCurrency}
          nftMetadata={nftMetadata}
          buildTx={buildTx}
          transactionFee={transactionFee}
          nativeCurrencyBalance={nativeCurrencyBalance}
          toNextStep={toNextStep}
          updateBuiltTx={updateBuiltTx}
          updateRecipientAddress={updateRecipientAddress}
        />
      )}
      {step === SendGameItemStep.Confirm && transactionFee && recipientAddress && (
        <SendGameItemConfirm
          isLoading={isLoading}
          nativeCurrency={nativeCurrency}
          nftMetadata={nftMetadata}
          recipientAddress={recipientAddress}
          builtTx={builtTx}
          transactionFee={transactionFee}
          onConfirm={handleConfirm}
          onPrev={toPrevStep}
        />
      )}
    </>
  );
};
