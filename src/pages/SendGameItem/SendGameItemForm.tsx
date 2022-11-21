import BigNumber from 'bignumber.js';
import { useNavigate } from 'react-router-dom';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Controller, useFormState, useWatch } from 'react-hook-form';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

import QrCodeIcon from '@mui/icons-material/QrCode';

import { boxCreator } from '@components/boxCreator';
import { CustomTheme, useTheme } from '@mui/material';
import BackNavigation from '@components/BackNavigation';
import { ProceduralFooter } from '@components/ProceduralFooter';
import { formatAmount } from '@components/TokenValueDisplay/format-amount';

import Colors from '@theme/colors';
import nodeProvider from '@services/provider/node';
import { useSendGameItem } from '@hooks/useSendGameItem';
import { useIsContractAddress } from '@hooks/useIsContractAddress';
import { fieldErrorMessages } from '@lib/react-hook-form/field-error-messages';

import { QrScanner } from './QrScanner';

const Root = boxCreator({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
});

const GrowBox = boxCreator({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  mx: 3,
});

const NetworkFeeBox = boxCreator({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: Colors.nonClickableGray,
  mx: 3,
  p: 1.5,
  borderRadius: 3,
});

interface SendGameItemFormProps {
  control: NonNullable<ReturnType<typeof useSendGameItem>['control']>;
  nativeCurrency: NonNullable<ReturnType<typeof useSendGameItem>['nativeCurrency']>;
  nftMetadata: NonNullable<ReturnType<typeof useSendGameItem>['nftMetadata']>;
  buildTx: ReturnType<typeof useSendGameItem>['buildTx'];
  nativeCurrencyBalance: ReturnType<typeof useSendGameItem>['nativeCurrencyBalance'];
  transactionFee: ReturnType<typeof useSendGameItem>['transactionFee'];
  toNextStep: ReturnType<typeof useSendGameItem>['toNextStep'];
  updateBuiltTx: ReturnType<typeof useSendGameItem>['updateBuiltTx'];
  updateRecipientAddress: ReturnType<typeof useSendGameItem>['updateRecipientAddress'];
}

export const SendGameItemForm: FC<SendGameItemFormProps> = ({
  control,
  nativeCurrency,
  nftMetadata,
  buildTx,
  nativeCurrencyBalance,
  transactionFee,
  toNextStep,
  updateBuiltTx,
  updateRecipientAddress,
}) => {
  const navigate = useNavigate();
  const [isBuildingTransaction, setBuildingTransaction] = useState(false);

  const inputAddress = useWatch({ control, name: 'recipientAddress' });
  const { isValid } = useFormState({ control });
  const theme = useTheme() as CustomTheme;

  const [activeCamera, setActiveCamera] = useState(false);

  const { isLoading: isContractAddressLoading, isContractAddress } = useIsContractAddress(
    inputAddress,
    nodeProvider[nftMetadata.chainId],
  );

  const isInsufficientBalance = useMemo(() => {
    const nativeBalanceBn = new BigNumber(nativeCurrencyBalance?.balance ?? 0);

    return nativeBalanceBn.isLessThan(transactionFee ?? 0);
  }, [nativeCurrencyBalance?.balance, transactionFee]);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleNext = useCallback(async () => {
    try {
      setBuildingTransaction(true);

      const tx = await buildTx(inputAddress);

      updateBuiltTx(tx);
      updateRecipientAddress(inputAddress);

      toNextStep();
    } catch {
      setBuildingTransaction(false);
    }
  }, [buildTx, inputAddress, toNextStep, updateBuiltTx, updateRecipientAddress]);

  return (
    <Root>
      <BackNavigation
        label={`Send ${nftMetadata.data.name}`}
        onBackPress={() => navigate(-1)}
        labelProps={{
          fontWeight: '600',
        }}
      />
      <GrowBox>
        <Box
          component="img"
          src={nftMetadata.data.image}
          sx={{
            objectFit: 'contain',
            width: 64,
            aspectRatio: '1 / 1',
            borderRadius: 3,
            backgroundColor: Colors.placeholderText,
          }}
        />

        <Controller
          control={control}
          name="recipientAddress"
          render={({ field, fieldState }) => (
            <>
              <TextField
                fullWidth
                autoComplete="off"
                size="small"
                color={isContractAddress ? 'warning' : undefined}
                placeholder="Recipient's Address"
                InputProps={{
                  sx: {
                    borderRadius: '3px',
                    pr: '8px',
                  },
                  endAdornment: (
                    <InputAdornment position="start">
                      <Button
                        onClick={() => setActiveCamera(!activeCamera)}
                        sx={{
                          position: 'relative',
                          width: '12px',
                          height: '1.4375em',
                          backgroundColor: theme.palette.colors.clickableGray,
                          p: '6px 0',
                          textAlign: 'center',
                          borderRadius: '3px',
                          minWidth: '32px',
                        }}
                      >
                        <QrCodeIcon style={{ color: theme.palette.primary.main, cursor: 'pointer' }} fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{ my: 3 }}
                inputProps={{
                  spellCheck: false,
                  style: {
                    borderRadius: '3px',
                  },
                }}
                {...field}
                error={Boolean(fieldState.error)}
                FormHelperTextProps={{ style: { margin: '8px 0px 0px 0px' } }}
                helperText={isContractAddress ? fieldErrorMessages.contractAddressWarning : fieldState.error?.message}
              />
              <QrScanner
                activeCamera={activeCamera}
                setActiveCamera={setActiveCamera}
                nftMetadata={nftMetadata}
                field={field}
              />
            </>
          )}
        />
      </GrowBox>

      {isInsufficientBalance && (
        <Typography variant="h5" color="error.main" mx={3} mb={1}>
          Not enough gas to pay for the network fee.
        </Typography>
      )}
      <NetworkFeeBox>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: 12 }}>
          Network Fee
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ fontSize: 12 }}>
          {transactionFee == null
            ? 'Loading...'
            : formatAmount({
                token: nativeCurrency,
                amount: transactionFee,
                precision: 'custody',
              })}
        </Typography>
      </NetworkFeeBox>

      <ProceduralFooter
        sx={{ pt: 3 }}
        onAdvance={handleNext}
        onCancel={handleCancel}
        isLoading={isBuildingTransaction}
        buttonProps={{ fontWeight: '600', color: theme.palette.colors.primaryText }}
        isAdvanceEnabled={
          isValid &&
          !(isContractAddressLoading || isBuildingTransaction || isInsufficientBalance) &&
          transactionFee != null
        }
      />
    </Root>
  );
};
