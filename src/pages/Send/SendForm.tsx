import BigNumber from 'bignumber.js';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useController, useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@components/Button';
import AssetIcon from '@components/AssetIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { CustomTheme, useTheme } from '@mui/material/styles';
import { formatAmount } from '@components/TokenValueDisplay/format-amount';

import {
  checkEnoughBalance,
  formatAmountInputOnChange,
  getMaximumAvailableSendBalance,
} from '@services/APIServices/tx-builder';
import { useTokenByKey } from '@hooks/useTokenByKey';
import { useNativeCurrency } from '@hooks/useNativeCurrency';
import { useIsContractAddress } from '@hooks/useIsContractAddress';
import { fieldErrorMessages } from '@lib/react-hook-form/field-error-messages';
import { SendFormProps, SendFormInput } from '@gryfyn-types/props/SendTokenProps';

import { addressValidationRules, amountValidationRules } from './validations';

export const SendForm = ({
  sendToken,
  gasPrice,
  gasPayer,
  isProcessing,
  tokenBalance,
  onSubmitForm,
  buildTxErrorMessage,
}: SendFormProps) => {
  const navigate = useNavigate();
  const theme = useTheme() as CustomTheme;
  const token = useTokenByKey(sendToken.assetKey);
  const nativeToken = useNativeCurrency(sendToken.chainId);

  const { setValue, handleSubmit, control, trigger } = useForm<SendFormInput>({
    mode: 'onChange',
    reValidateMode: 'onSubmit',
    criteriaMode: 'firstError',
    shouldFocusError: true,
  });

  const {
    field: { onChange: toAddressChanged, value: toAddressValue, ref: toAddressRef },
    fieldState: { error: toAddressError },
  } = useController({
    name: 'toAddress',
    control,
    defaultValue: '',
    rules: addressValidationRules(sendToken),
  });

  const { isContractAddress } = useIsContractAddress(toAddressValue, sendToken?.provider ?? '');

  const {
    field: { onChange: amountChanged, value: amountValue, ref: amountRef },
    fieldState: { error: amountError },
  } = useController({
    name: 'amount',
    control,
    defaultValue: '',
    rules: amountValidationRules(sendToken),
  });

  const readableMaxAvailableSendBalance = useMemo(
    () =>
      getMaximumAvailableSendBalance(
        typeof sendToken !== 'undefined' ? sendToken.gasLimit : '0x0',
        gasPrice,
        sendToken,
        gasPayer,
      ),
    [sendToken, gasPrice, gasPayer],
  );

  const enoughBalance = useMemo(
    () => checkEnoughBalance(amountValue, sendToken, gasPrice, gasPayer).fee,
    [sendToken, gasPrice, gasPayer, amountValue],
  );

  const enableNextButton = useMemo(() => {
    return !toAddressError && !amountError && toAddressValue && Number(gasPrice) && enoughBalance;
  }, [amountError, gasPrice, toAddressError, toAddressValue, enoughBalance]);
  if (amountError) console.log('amountError = *** ', amountError);
  if (toAddressError) console.log('toAddressError = *** ', toAddressError);

  if (!token || !nativeToken) {
    return null;
  }

  console.log(`gasLimit: ${sendToken.gasLimit}`);

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', marginRight: '24px', marginLeft: '24px' }}
    >
      <div style={{ flex: 10 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ListItemAvatar sx={{ display: 'flex', justifyContent: 'center' }}>
            <AssetIcon
              assetIconLength={40}
              networkIconLength={16}
              assetImageUrl={String(sendToken?.icon)}
              networkLogoUrl={String(sendToken?.networkIcon)}
            />
          </ListItemAvatar>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            hiddenLabel
            size="small"
            variant="outlined"
            sx={{ mt: '12px' }}
            color={isContractAddress ? 'warning' : undefined}
            value={toAddressValue}
            inputRef={toAddressRef}
            error={Boolean(toAddressError)}
            onChange={toAddressChanged}
            InputProps={{
              sx: {
                fontSize: '12px',
              },
            }}
            placeholder="Recipient address"
            helperText={isContractAddress ? fieldErrorMessages.contractAddressWarning : toAddressError?.message}
            FormHelperTextProps={{ style: { margin: '8px 0px 0px 0px' } }}
          />

          <TextField
            fullWidth
            hiddenLabel
            variant="outlined"
            placeholder="Amount"
            value={amountValue}
            inputRef={amountRef}
            error={!!amountError}
            onChange={(e) => formatAmountInputOnChange(e.target.value, amountChanged, sendToken)}
            size="small"
            sx={{
              mt: '12px',
              height: '36px',
            }}
            helperText={amountError && `${amountError.message}`}
            FormHelperTextProps={{ style: { margin: '8px 0px 0px 0px' } }}
            InputProps={{
              sx: {
                fontSize: '12px',
                paddingRight: '4px',
                borderRadius: '3px',
              },

              endAdornment: (
                <InputAdornment position="end">
                  <>
                    <Typography variant="h4" sx={{ mr: 1, color: theme.palette.colors.placeholderText }}>
                      {sendToken?.tokenAssetTicker}
                    </Typography>
                    <Button
                      variant="text"
                      sx={{
                        height: '28px',
                        color: theme.palette.primary.main,
                        fontSize: '12px',
                        fontWeight: '600',
                        ':hover': {
                          background: 'none',
                        },
                      }}
                      onClick={() => {
                        setValue('amount', readableMaxAvailableSendBalance);
                        trigger('amount');
                      }}
                    >
                      MAX
                    </Button>
                  </>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="h5" color={theme.palette.colors.secondaryText} sx={{ mt: amountError ? 3 : 1 }}>
            {`Balance: ${formatAmount({
              token,
              amount: sendToken.maxAmount,
              precision: 'custody',
            })}`}
          </Typography>
        </Box>
        {!enoughBalance && (
          <Typography variant="h5" color={theme.palette.colors.errorPrimary}>
            Not enough balance to pay for the network fee.
          </Typography>
        )}
        {buildTxErrorMessage.length > 0 && (
          <Typography variant="h5" color={theme.palette.colors.errorPrimary}>
            {buildTxErrorMessage}
          </Typography>
        )}
        {typeof gasPrice !== 'undefined' && (
          <Box
            sx={{
              display: 'flex',
              height: '36px',
              justifyContent: 'space-between',
              backgroundColor: 'colors.nonClickableGray',
              color: 'text.secondary',
              padding: '12px',
              mt: '12px',
              borderRadius: '3px',
            }}
          >
            <Typography variant="h4">Network Fee</Typography>
            <Typography variant="h4" data-testid="network-fee">
              {Number(gasPrice) === 0
                ? 'Loading...'
                : formatAmount({
                    token: nativeToken,
                    amount: new BigNumber(sendToken.gasLimit).multipliedBy(gasPrice).toString(),
                    precision: 'custody',
                  })}
            </Typography>
          </Box>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Button
            fullWidth
            disableElevation
            color="secondary"
            variant="contained"
            onClick={() => navigate(`/token-details/${tokenBalance?.token.key}`, { replace: true })}
            sx={{
              mr: 1,
              fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
              borderRadius: '3px',
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            fullWidth
            type="submit"
            disableElevation
            color="primary"
            variant="contained"
            loading={isProcessing}
            disabled={!enableNextButton}
            sx={{ fontWeight: '600', textTransform: 'none', fontSize: '16px', color: '#fff', borderRadius: '3px' }}
          >
            Next
          </LoadingButton>
        </Box>
      </div>
    </form>
  );
};
