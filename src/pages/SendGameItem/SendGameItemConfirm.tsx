import React, { FC, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { boxCreator } from '@components/boxCreator';
import { NetworkBar } from '@components/NetworkBar';
import BackNavigation from '@components/BackNavigation';
import { NetworkFeeBar } from '@components/NetworkFeeBar';
import { WalletAddressBar } from '@components/WalletAddressBar';
import { ProceduralFooter } from '@components/ProceduralFooter';

import { useSendGameItem } from '@hooks/useSendGameItem';
import { formatAmount } from '@components/TokenValueDisplay/format-amount';

const Root = boxCreator({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
});

interface SendGameItemConfirmProps {
  isLoading: boolean;
  nativeCurrency: NonNullable<ReturnType<typeof useSendGameItem>['nativeCurrency']>;
  nftMetadata: NonNullable<ReturnType<typeof useSendGameItem>['nftMetadata']>;
  builtTx: ReturnType<typeof useSendGameItem>['builtTx'];
  transactionFee: NonNullable<ReturnType<typeof useSendGameItem>['transactionFee']>;
  recipientAddress: NonNullable<ReturnType<typeof useSendGameItem>['recipientAddress']>;
  onConfirm: ReturnType<typeof useSendGameItem>['handleConfirm'];
  onPrev: ReturnType<typeof useSendGameItem>['toPrevStep'];
}

export const SendGameItemConfirm: FC<SendGameItemConfirmProps> = ({
  builtTx,
  isLoading,
  nftMetadata,
  nativeCurrency,
  transactionFee,
  recipientAddress,
  onPrev,
  onConfirm,
}) => {
  const nftName = nftMetadata.data.name;

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  if (!builtTx) {
    console.error('Transaction not built');
    return null;
  }

  return (
    <Root>
      <BackNavigation label="Confirm Send" onBackPress={onPrev} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          align="center"
          variant="h1"
          color="text.primary"
          sx={{
            mt: 2,
            mb: 1.5,
            lineHeight: 1,
            fontWeight: '600',
          }}
        >
          {nftName}
        </Typography>
        <Typography align="center" variant="body2" color="text.secondary" sx={{ fontSize: 10 }}>
          Send only {nftName} on <span style={{ fontWeight: '600' }}>{nativeCurrency.chain.chainName}</span> network to
          this deposit address.
          <br />
          Sending any other NFT may result in permanent loss.
        </Typography>

        <Stack spacing={1.5} sx={{ m: 3 }}>
          <NetworkBar
            networkIconUrl={nativeCurrency.network.pngNetworkIconUrl}
            chainName={nativeCurrency.chain.chainName}
          />

          <WalletAddressBar walletAddress={recipientAddress} walletLable="Recipient Address" />

          <NetworkFeeBar
            formattedGasFee={formatAmount({
              token: nativeCurrency,
              amount: transactionFee,
              precision: 'custody',
            })}
          />
        </Stack>
      </Box>
      <ProceduralFooter
        requireDivider
        advanceText="Confirm"
        isLoading={isLoading}
        onAdvance={handleConfirm}
        isAdvanceEnabled={!isLoading && !!builtTx}
      />
    </Root>
  );
};
