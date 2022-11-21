import { utils, BigNumber } from 'ethers';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetTokensQuery } from '@redux/api/assetMaster';
import { useGetBalancesQuery } from '@redux/api/bookKeeping';

import BackNavigation from '@components/BackNavigation';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';

import {
  GasFee,
  BuiltTx,
  getGasPrice,
  ContractTransfer,
  NativeBuildParams,
  getFunctionParams,
  constructSendToken,
  ContractBuildParams,
  buildNativeTransaction,
  NUMBER_WITH_TRAILING_ZEROES,
  buildContractTransferTransaction,
} from '@services/APIServices/tx-builder';
import nodeProvider from '@services/provider/node';
import { useLocationStateData } from '@hooks/useLocationStateData';
import SendToken from '@gryfyn-types/data-transfer-objects/SendToken';
import { SendFormInput, SendPageTokenDetails } from '@gryfyn-types/props/SendTokenProps';

import { SendForm } from './SendForm';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';

export const SendPage = () => {
  const navigate = useNavigate();
  const tokenDetails = useLocationStateData<SendPageTokenDetails>();
  const token = tokenDetails?.token;
  const tokenBalance = tokenDetails?.tokenBalance;
  const { data: tokens = [] } = useGetTokensQuery();
  const { data: balances = [] } = useGetBalancesQuery();
  const [gasPrice, setGasPrice] = useState<GasFee>({
    maxFeePerGas: BigNumber.from(0).toHexString(), // "0x0"
    maxPriorityFeePerGas: BigNumber.from(0).toHexString(), // "0x0"
  });
  const [gasPayer, setGasPayer] = useState<SendToken>();
  const [sendToken, setSendToken] = useState<SendToken>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [buildTxErrorMessage, setBuildTxErrorMessage] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    void (async () => {
      const nativeToken = tokens.find((t) => t.chain.chainID === token?.chain.chainID && t.isNative);
      const providerUrl = nodeProvider[nativeToken?.chain.chainID ?? '-1'];
      const sendTokenBalance = balances.filter((b) => b.assetId === token?.key);
      const gasPayerBalance = balances.filter((b) => b.assetId === nativeToken?.key);

      if (typeof token === 'undefined' || typeof nativeToken === 'undefined' || typeof providerUrl === 'undefined') {
        console.log('Token not supported from AMD');
        return;
      }

      const constructedGasPayer = constructSendToken(nativeToken, nativeToken, gasPayerBalance, providerUrl);
      const constructedSendToken = constructSendToken(token, nativeToken, sendTokenBalance, providerUrl);

      setGasPayer(constructedGasPayer);
      setSendToken(constructedSendToken);

      // Poll gasFee every 10s
      const getAndUpdateGas = async (): Promise<void> => {
        const gasPriceFromOracleOrChain = await getGasPrice(nativeToken?.chain.chainID);

        console.log(`gasFee: ${JSON.stringify(gasPriceFromOracleOrChain)}`);

        setGasPrice(gasPriceFromOracleOrChain);
      };
      await getAndUpdateGas();
      // const intervalId = setInterval(getAndUpdateGas, 10000);

      setIsLoading(false);

      // return () => clearInterval(intervalId);
    })();
  }, [tokens, balances, token]);

  const onSubmitForm = async ({ toAddress: to, amount }: SendFormInput): Promise<void> => {
    if (typeof sendToken !== 'undefined') {
      setIsProcessing(true);
      // CAUTION:
      // in builder calls, the first param is named `ticker`,
      // which IS NOT THE ASSET TICKER, instead
      // it is the ticker (or symbol) of native token of that chain with chainId
      // so here we need to draw the network info
      const { fromAddress: from, chainId, decimals, standard, symbol, contractAddress } = sendToken;
      const _value = utils.parseUnits(amount, `${decimals}`).toHexString();
      const value = `0x${Number(_value).toString(16)}`;
      // confirm parsed value have no leading zeros
      // when using `toHexString` function, it will pad the hex value to "complete byte",
      // which is having a chance of resulting leading zero

      let tx: BuiltTx | undefined;

      try {
        if (standard === TokenStandard.ERC20 && !!symbol) {
          const txParams: ContractBuildParams<ContractTransfer> = {
            from,
            chainId,
            maxFeePerGas: gasPrice.maxFeePerGas,
            contractAddress: String(contractAddress),
            maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
            functionParams: getFunctionParams(sendToken, { to, value }) as ContractTransfer,
          };

          tx = await buildContractTransferTransaction(txParams);
        } else {
          const txParams: NativeBuildParams = {
            to,
            from,
            value,
            chainId,
            maxFeePerGas: gasPrice.maxFeePerGas,
            maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
          };

          tx = await buildNativeTransaction(txParams);
        }
        // Hotfix: gas limit in tx-builder is not from AMD, so override here with gas limit in FE.
        // REMARK: use gasLimit from tx-builder, as there will be estimate result
        // tx = { ...tx, gasLimit };
      } catch (err: any) {
        /**
         * TODO:
         * should follow error list in tx-builder, for example if build failed due to estimation error
         * { "code": -32005, "message": "Unable to estimate gas limit for this tx", data: { ... } }
         */
        console.log(err);
        setIsProcessing(false);
        setBuildTxErrorMessage('Unexpected error when constructing transaction.');
      }

      if (typeof tx !== 'undefined') {
        try {
          setBuildTxErrorMessage('');
          navigate('/page/wallet/send/confirmation', {
            replace: true,
            state: {
              data: {
                token,
                gasPayer,
                sendToken,
                builtTx: tx,
                tokenBalance,
                userInput: {
                  to,
                  amount: amount.replace(NUMBER_WITH_TRAILING_ZEROES, '$1'),
                },
              },
            },
          });
        } catch (err: any) {
          console.log(err);
          setIsProcessing(false);
          setBuildTxErrorMessage('Unexpected error when signing transaction.');
        }
      }
      setIsProcessing(false);
    }
  };

  return (
    <DefaultErrorBoundary>
      <BackNavigation
        label={typeof sendToken !== 'undefined' ? `Send ${sendToken?.symbol}` : 'Send'}
        onBackPress={() => navigate(`/token-details/${token?.key}`, { replace: true })}
        labelProps={{ fontWeight: '600' }}
      />
      <Box sx={{ flex: 1, height: '100%' }}>
        {isLoading || !sendToken ? (
          <Box
            sx={{
              p: 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress disableShrink />
          </Box>
        ) : (
          <SendForm
            sendToken={sendToken}
            gasPrice={gasPrice.maxFeePerGas}
            gasPayer={gasPayer}
            isProcessing={isProcessing}
            tokenBalance={tokenBalance}
            onSubmitForm={onSubmitForm}
            buildTxErrorMessage={buildTxErrorMessage}
          />
        )}
      </Box>
    </DefaultErrorBoundary>
  );
};
