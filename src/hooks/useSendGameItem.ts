import { useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { getTime } from 'date-fns';
import { BigNumber, utils } from 'ethers';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  GasFee,
  BuiltTx,
  getGasPrice,
  constructSendToken,
  ContractBuildParams,
  ContractSafeTransferFrom,
  buildContractSafeTransferFromERC721Transaction,
  buildContractSafeTransferFromERC1155Transaction,
} from '@services/APIServices/tx-builder';
import nodeProvider from '@services/provider/node';

import { addPendingTx } from '@redux/reducer/pendingTransactions';
import { useGetAssetMetadataQuery } from '@redux/api/assetMetadataCache';
import { useGetBalancesByAssetIdsQuery, useGetBalancesQuery } from '@redux/api/bookKeeping';

import NftTokenData from '@gryfyn-types/data-transfer-objects/NftTokenData';
import Token, { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';

import { CachedJsonRpcProviders } from '@lib/ethers/cached-providers';
import { fieldErrorMessages } from '@lib/react-hook-form/field-error-messages';

import { useTokenByKey } from './useTokenByKey';
import { useNativeCurrency } from './useNativeCurrency';
import { SignTxSuccessCallback, useMfaFlow } from './useMfaFlow';

export enum SendGameItemStep {
  FillForm,
  Confirm,
}

interface IFormData {
  recipientAddress: string;
}

const schema = yup.object().shape({
  recipientAddress: yup
    .string()
    .test('Valid Address', fieldErrorMessages.addressValidation, (address) => utils.isAddress(address ?? ''))
    .required(fieldErrorMessages.fieldIsRequired),
});

export const useSendGameItem = (key: string, tokenId: string) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sendError, setSendError] = useState('');
  const [gasFee, setGasFee] = useState<GasFee | null>(null);
  const [step, setStep] = useState(SendGameItemStep.FillForm);
  const [builtTx, setBuiltTx] = useState<BuiltTx | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);

  const { control } = useForm<IFormData>({
    mode: 'all',
    reValidateMode: 'onSubmit',
    shouldFocusError: true,
    resolver: yupResolver(schema),
    defaultValues: {
      recipientAddress: '',
    },
  });

  const nftCollection = useTokenByKey(key);
  const nativeCurrency = useNativeCurrency(nftCollection?.chain?.chainID);

  const { data: balances = [] } = useGetBalancesQuery();
  const { data: nftTokens } = useGetBalancesByAssetIdsQuery({
    assetIds: [key],
  });

  const gasPayerBalance = balances.filter((b) => b.assetId === nativeCurrency?.key);
  const nftToken = useMemo(() => {
    return nftTokens?.find((token) => token.nftTokenId === tokenId) ?? null;
  }, [nftTokens, tokenId]);

  const { data: nftMetadata } = useGetAssetMetadataQuery(
    {
      chainId: nftToken?.chainId,
      contractAddress: nftCollection?.contractAddress,
      tokenId: nftToken?.nftTokenId,
    },
    { skip: !nftToken || !nftCollection },
  );

  const toPrevStep = useCallback(() => {
    setStep((currStep) => Math.max(currStep - 1, 0));
  }, []);

  const toNextStep = useCallback(() => {
    // Min would be length - 1 (0-indexed)
    setStep((currStep) => Math.min(currStep + 1, Object.values(SendGameItemStep).length - 1));
  }, []);

  const handleSignTxSuccess = useCallback<SignTxSuccessCallback>(
    async (signedTx, { rawTx }) => {
      try {
        const chainId = nativeCurrency?.chain.chainID;
        const providerUrl = nodeProvider[chainId ?? ''];

        const provider = CachedJsonRpcProviders.getInstance(providerUrl);
        const tx = await provider.sendTransaction(signedTx);

        dispatch(
          addPendingTx({
            hash: tx.hash,
            token: constructSendToken(
              nftCollection as Token,
              nativeCurrency as Token,
              [{ address: (nftToken as NftTokenData).address, balance: (nftToken as NftTokenData).balance }],
              providerUrl,
            ),
            gasPayer: constructSendToken(
              nativeCurrency as Token,
              nativeCurrency as Token,
              gasPayerBalance,
              providerUrl,
            ),
            tx: rawTx as BuiltTx,
            createdAt: getTime(new Date()).toString(),
            nftId: nftMetadata?.tokenId,
          }),
        );

        navigate('/recent-activity');
      } catch (rawError: any) {
        const jrpcError = rawError?.error?.error;
        console.log('JRPC ERROR');
        console.log(JSON.stringify(rawError));
        const finalErrorMessage = typeof jrpcError !== 'undefined' ? jrpcError.message : '';
        setSendError(`${finalErrorMessage.charAt(0).toUpperCase()}${finalErrorMessage.slice(1)}`);
      }
    },
    [dispatch, gasPayerBalance, nativeCurrency, navigate, nftCollection, nftMetadata?.tokenId, nftToken],
  );
  const { signTx, signTxLoading, signTxError } = useMfaFlow({ signTx: handleSignTxSuccess });

  const updateBuiltTx = useCallback((tx: BuiltTx) => {
    setBuiltTx(tx);
  }, []);

  const buildTx = useCallback(
    async (_recipientAddress: string) => {
      if (!nftMetadata || !nftToken || !nativeCurrency || !gasFee || !nftCollection?.gasLimit) {
        throw new Error(
          JSON.stringify({
            nftMetadata,
            nftToken,
            nativeCurrency,
            gasPrice: gasFee,
            gasLimit: nftCollection?.gasLimit,
          }),
        );
      }

      const contractStandard = nftMetadata.tokenStandard as TokenStandard;

      const {
        chain: { chainID: chainId },
      } = nativeCurrency;
      const { contractAddress, tokenId: nftId } = nftMetadata;
      const { maxFeePerGas, maxPriorityFeePerGas } = gasFee;

      if (!nativeCurrency) throw new Error(`can't get gas fee, nativeCurrency not found`);

      switch (contractStandard) {
        case TokenStandard.ERC721: {
          const txParams: ContractBuildParams<ContractSafeTransferFrom> = {
            from: nftToken.address,
            chainId,
            contractAddress,
            functionParams: {
              from: nftToken.address,
              to: _recipientAddress,
              tokenId: BigNumber.from(nftId).toHexString(),
            },
            maxFeePerGas,
            maxPriorityFeePerGas,
          };
          // Hotfix: gas limit in tx-builder is not from AMD, so override here with gas limit in FE.
          const tx = {
            ...(await buildContractSafeTransferFromERC721Transaction(txParams)),
          };
          return tx;
        }
        case TokenStandard.ERC1155: {
          const commonTemplate = {
            from: nftToken.address,
            chainId,
            contractAddress,
            maxFeePerGas,
            maxPriorityFeePerGas,
          };
          try {
            const txParams: ContractBuildParams<ContractSafeTransferFrom> = {
              ...commonTemplate,
              functionParams: {
                from: nftToken.address,
                to: _recipientAddress,
                id: BigNumber.from(nftId).toHexString(),
                // Currently only can transfer 1 NFT per transaction
                amount: BigNumber.from(1).toHexString(),
                data: '0x',
              },
            };
            // Hotfix: gas limit in tx-builder is not from AMD, so override here with gas limit in FE.
            const tx = {
              ...(await buildContractSafeTransferFromERC1155Transaction(txParams)),
            };
            return tx;
          } catch (error: unknown) {
            const txParams: ContractBuildParams<ContractSafeTransferFrom> = {
              ...commonTemplate,
              functionParams: {
                from: nftToken.address,
                to: _recipientAddress,
                id: BigNumber.from(nftId).toHexString(),
                // Currently only can transfer 1 NFT per transaction
                value: BigNumber.from(1).toHexString(),
                data: '0x',
              },
            };
            // Hotfix: gas limit in tx-builder is not from AMD, so override here with gas limit in FE.
            const tx = {
              ...(await buildContractSafeTransferFromERC1155Transaction(txParams)),
            };
            return tx;
          }
        }
        case TokenStandard.ERC20:
        default:
          throw new Error('Unsupported token standard');
      }
    },
    [gasFee, nativeCurrency, nftCollection?.gasLimit, nftMetadata, nftToken],
  );

  const transactionFee = useMemo<string | null>(() => {
    if (!gasFee || !nftCollection) return null;

    console.log(`maxFeePerGas: ${gasFee.maxFeePerGas}, gasLimit: ${nftCollection.gasLimit}`);

    return BigNumber.from(gasFee.maxFeePerGas).mul(nftCollection.gasLimit).toString();
  }, [gasFee, nftCollection]);

  const handleConfirm = useCallback(async () => {
    if (!nftToken || !nftCollection || !nativeCurrency || !builtTx) return;

    const chainId = nativeCurrency?.chain.chainID;
    const providerUrl = nodeProvider[chainId ?? ''];
    if (!providerUrl || !nftToken) {
      throw new Error(JSON.stringify({ nodeProvider, chainId, nftToken }));
    }

    setSendError('');
    signTx(nftToken.address, builtTx);
  }, [builtTx, nativeCurrency, nftCollection, nftToken, signTx]);

  useEffect(() => {
    if (!nativeCurrency?.chain?.chainID) {
      throw new Error('no nativeCurrency chainID for getGasPrice');
    }
    const getAndUpdateGas = async (): Promise<void> => {
      const _gasFee = await getGasPrice(nativeCurrency?.chain.chainID);

      console.log(`gasFee: ${JSON.stringify(_gasFee)}`);

      setGasFee(_gasFee);
    };

    void getAndUpdateGas();
  }, [nativeCurrency?.chain.chainID]);

  return {
    nativeCurrency,
    nativeCurrencyBalance: gasPayerBalance?.[0] ?? null,

    nftToken,
    nftMetadata,

    builtTx,
    buildTx,

    transactionFee,

    handleConfirm,
    updateBuiltTx,

    control,
    recipientAddress,
    updateRecipientAddress: setRecipientAddress,

    step,
    toNextStep,
    toPrevStep,

    sendError,
    signTxError,
    isLoading: signTxLoading,
  };
};
